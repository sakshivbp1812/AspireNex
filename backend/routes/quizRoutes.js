// routes/quizRoutes.js

const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const storeQuizScore = require('../controllers/quizController');
const getQuizLeaderboard = require('../controllers/quizController');

// POST /api/quizzes - Create a new quiz
router.post('/', quizController.createQuiz);
router.post('/score', storeQuizScore.storeQuizScore);

// GET /api/quizzes - Fetch all quizzes
router.get('/', quizController.getQuizzes);
router.get('/:quizId', quizController.getQuizById);
router.get('/:quizId/leaderboard', quizController.getQuizLeaderboard);
module.exports = router;
