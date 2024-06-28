// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const config = require('./config/config');
const quizRoutes = require('./routes/quizRoutes');
const cors = require('cors'); 
dotenv.config();

const app = express();
app.use(cors());
// Body parser middleware
app.use(express.json());
app.use('/api/quizzes', quizRoutes);


  const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Mongoose Connected");
        });
  }

  connectDB()

// Define routes
app.use('/api/auth', authRoutes);


app.get('/api/protected-route', authMiddleware, (req, res) => {
    // This route is protected and can only be accessed with a valid token
    res.json({ message: 'You have accessed a protected route!' });
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
