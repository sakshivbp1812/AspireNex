// pages/quiz/[quizId]/leaderboard.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const LeaderboardPage = () => {
  const router = useRouter();
  const { quizId } = router.query;
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}/leaderboard`);
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    if (quizId) {
      fetchLeaderboard();
    }
  }, [quizId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Quiz Leaderboard</h1>
      <div className="w-full max-w-lg">
        {leaderboard.map((entry, index) => (
          <div key={index} className="bg-white p-4 my-4 shadow-md rounded-lg">
            <p><strong>User:</strong> {entry.user}</p>
            <p><strong>Score:</strong> {entry.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
