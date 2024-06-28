// pages/HomePage.js
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const BackgroundBubble = ({ size, initialPosition }) => (
  <motion.div
    className={`absolute rounded-full bg-opacity-20 bg-white ${size}`}
    initial={{ x: initialPosition.x, y: initialPosition.y }}
    animate={{
      x: [initialPosition.x, initialPosition.x + 50, initialPosition.x - 50, initialPosition.x],
      y: [initialPosition.y, initialPosition.y - 50, initialPosition.y + 50, initialPosition.y],
    }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
  />
);

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <Head>
        <title>Quiz App - Challenge Your Mind</title>
      </Head>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        {/* Animated background bubbles */}
        <BackgroundBubble size="w-64 h-64" initialPosition={{ x: '10%', y: '20%' }} />
        <BackgroundBubble size="w-96 h-96" initialPosition={{ x: '70%', y: '60%' }} />
        <BackgroundBubble size="w-48 h-48" initialPosition={{ x: '40%', y: '80%' }} />

        {/* Mouse follower */}
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-white bg-opacity-10 blur-3xl"
          animate={{ x: mousePosition.x - 128, y: mousePosition.y - 128 }}
          transition={{ type: 'spring', damping: 10 }}
        />

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center p-10 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl max-w-2xl"
          >
            <motion.h1 
              className="text-5xl font-extrabold text-white mb-6"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              Welcome to the Quiz App
            </motion.h1>
            <p className="text-xl text-gray-200 mb-10">Embark on a journey of knowledge. Create mind-bending quizzes or challenge yourself with quizzes crafted by others.</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
              <Link href="/create-quiz" className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600">
                  <span className="flex items-center space-x-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600 -rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span className="pr-6 text-gray-100">Create Quiz</span>
                  </span>
                </button>
              </Link>
              <Link href="/take-quiz" className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600">
                  <span className="flex items-center space-x-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 -rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span className="pr-6 text-gray-100">Take Quiz</span>
                  </span>
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
