const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderboardSchema = new Schema({
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  scores: [{
    user: {
      type: String, // Changed from Schema.Types.ObjectId to String
      required: true
    },
    score: {
      type: Number,
      required: true
    }
  }]
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);