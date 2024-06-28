import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const svgs = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-blue-500 opacity-10"><path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" /><path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" /><path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" /></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-purple-500 opacity-10"><path d="M16.5 7.5h-9v9h9v-9z" /><path fill-rule="evenodd" d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15H21a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3A.75.75 0 013 15h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75zM6 6.75A.75.75 0 016.75 6h10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75z" clip-rule="evenodd" /></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-pink-500 opacity-10"><path fill-rule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clip-rule="evenodd" /></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-green-500 opacity-10"><path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clip-rule="evenodd" /></svg>',
];

const MovingSVG = ({ svg, size }) => {
  const randomPosition = () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  });

  const start = randomPosition();
  const end = randomPosition();

  return (
    <motion.div
      className="absolute"
      style={{
        width: size,
        height: size,
      }}
      initial={{
        x: `${start.x}vw`,
        y: `${start.y}vh`,
        scale: Math.random() * 0.5 + 0.5,
        rotate: Math.random() * 360,
      }}
      animate={{
        x: [`${start.x}vw`, `${end.x}vw`],
        y: [`${start.y}vh`, `${end.y}vh`],
        rotate: [0, 360],
        scale: [Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 1],
      }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 20 + Math.random() * 10,
        ease: "linear"
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default function HomePage() {
  const movingSVGs = Array(20).fill().map((_, i) => {
    const svg = svgs[i % svgs.length];
    const size = 40 + Math.random() * 60;
    return <MovingSVG key={i} svg={svg} size={size} />;
  });

  return (
    <>
      <Head>
        <title>Quiz App - Challenge Your Mind</title>
      </Head>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Additional background element */}
        <div className="absolute inset-0 bg-[url('/circuit-board.svg')] opacity-5"></div>

        {/* Static background SVGs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96" dangerouslySetInnerHTML={{ __html: svgs[0] }} />
          <div className="absolute top-1/4 right-0 w-80 h-80" dangerouslySetInnerHTML={{ __html: svgs[1] }} />
          <div className="absolute bottom-0 left-1/4 w-72 h-72" dangerouslySetInnerHTML={{ __html: svgs[2] }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64" dangerouslySetInnerHTML={{ __html: svgs[3] }} />
          <div className="absolute bottom-1/3 left-10 w-56 h-56" dangerouslySetInnerHTML={{ __html: svgs[0] }} />
          <div className="absolute top-20 right-1/4 w-48 h-48" dangerouslySetInnerHTML={{ __html: svgs[2] }} />
          <div className="absolute bottom-20 right-20 w-40 h-40" dangerouslySetInnerHTML={{ __html: svgs[1] }} />
          <div className="absolute top-1/3 left-1/3 w-60 h-60" dangerouslySetInnerHTML={{ __html: svgs[3] }} />
        </div>

        {/* Moving background SVGs */}
        {movingSVGs}

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center max-w-3xl"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              Welcome to the Quiz App
            </motion.h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10">
              Embark on a journey of knowledge. Create mind-bending quizzes or challenge yourself with quizzes crafted by others.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
              <Link href="/create-quiz" className="group">
                <motion.button 
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Quiz
                </motion.button>
              </Link>
              <Link href="/take-quiz" className="group">
                <motion.button 
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Take Quiz
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
