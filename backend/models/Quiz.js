const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean
});

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [optionSchema],
  multiCorrect: Boolean,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  timeLimit: Number
});

const quizSchema = new mongoose.Schema({
  quizCreator: String,
  topic: String,
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);
