// pages/take-quiz.js

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const TakeQuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/quizzes');
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleStartQuiz = (quizId) => {
    router.push(`/quiz/${quizId}`); // Navigate to quiz page with quizId
  };

  // Calculate total time, total questions, etc.
  const totalQuizzes = quizzes.length;
  const totalTime = quizzes.reduce((total, quiz) => total + quiz.questions.length * quiz.questions[0].timeLimit, 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Take Quiz</h1>
      <div className="grid gap-4">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{quiz.topic}</h2>
            <p>Created by: {quiz.quizCreator}</p>
            <p>Total Questions: {quiz.questions.length}</p>
            <p>Difficulty Level: {quiz.questions[0].difficulty}</p>
            <p>Total Time Needed: {quiz.questions.reduce((total, q) => total + q.timeLimit, 0)} seconds</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleStartQuiz(quiz._id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Start Quiz
              </button>
              <Link href={`/quiz/${quiz._id}/leaderboard`} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            
                  View Leaderboard
                
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TakeQuizPage;
