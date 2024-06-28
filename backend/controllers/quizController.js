const Quiz = require('../models/Quiz');
const Leaderboard = require('../models/Leaderboard');
const QuizScore = require('../models/QuizScore');
const mongoose = require('mongoose');

exports.createQuiz = async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.storeQuizScore = async (req, res) => {
  const { userId, quizId, quizTopic, score } = req.body;

  try {
    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ message: 'Invalid quizId' });
    }

    // Save the score to QuizScore
    const newScore = new QuizScore({
      user: userId,
      quiz: quizId,
      quizTopic,
      score,
    });
    await newScore.save();

    // Update or create leaderboard entry
    const updateResult = await Leaderboard.findOneAndUpdate(
      { quiz: quizId },
      {
        $push: {
          scores: {
            $each: [{ user: userId, score }],
            $sort: { score: -1 },
            $slice: 10 // Keep only top 10 scores
          }
        }
      },
      { upsert: true, new: true, runValidators: false } // Added runValidators: false
    );

    res.status(201).json({ message: 'Score saved successfully', leaderboard: updateResult });
  } catch (error) {
    console.error('Error in storeQuizScore:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
exports.getQuizLeaderboard = async (req, res) => {
  try {
    const quizId = req.params.quizId;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ message: 'Invalid quizId' });
    }

    const leaderboard = await Leaderboard.findOne({ quiz: quizId })
      .populate('scores.user', 'name') // Assuming you want to include user names
      .lean();

    if (!leaderboard) {
      return res.status(404).json({ message: 'Leaderboard not found for this quiz' });
    }

    // Sort scores and limit to top 10
    const topScores = leaderboard.scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.status(200).json(topScores);
  } catch (error) {
    console.error('Error in getQuizLeaderboard:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};