import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/authContext';
import { motion, AnimatePresence } from 'framer-motion';

const QuizPage = () => {
  const router = useRouter();
  const { quizId } = router.query;
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [answerSummary, setAnswerSummary] = useState([]);
  const [remainingTime, setRemainingTime] = useState(null);

  const { user } = useAuth();
  console.log("8888888888888888888-",user);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz');
        }
        const data = await response.json();
        setQuiz(data);
        setUserAnswers(new Array(data.questions.length).fill(null));
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    let interval;
    if (quizStarted && quiz && currentQuestionIndex >= 0 && currentQuestionIndex < quiz.questions.length && !showSummary) {
      const question = quiz.questions[currentQuestionIndex];
      if (question.timeLimit > 0) {
        setRemainingTime(question.timeLimit);
        interval = setInterval(() => {
          setRemainingTime((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(interval);
              handleNextQuestion();
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      } else {
        setRemainingTime(null);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [quizStarted, currentQuestionIndex, quiz, showSummary]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
  };

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  }, [currentQuestionIndex, quiz]);

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    let totalScore = 0;
    const summary = [];

    userAnswers.forEach((answer, index) => {
      if (!quiz || !quiz.questions[index]) return;
      const question = quiz.questions[index];
      const correctAnswers = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt.text);

      let userCorrectAnswers = [];
      let userIncorrectAnswers = [];
      if (question.multiCorrect) {
        userCorrectAnswers = answer ? answer.map((idx) => question.options[idx].text).filter((ans) => correctAnswers.includes(ans)) : [];
        userIncorrectAnswers = answer ? answer.map((idx) => question.options[idx].text).filter((ans) => !correctAnswers.includes(ans)) : [];
        totalScore += userCorrectAnswers.length === correctAnswers.length && userIncorrectAnswers.length === 0 ? 10 : 0;
      } else {
        const selectedOption = question.options[answer];
        if (selectedOption && selectedOption.isCorrect) {
          totalScore += 10;
          userCorrectAnswers.push(selectedOption.text);
        } else if (selectedOption) {
          userIncorrectAnswers.push(selectedOption.text);
        }
      }

      summary.push({
        questionText: question.questionText,
        correctAnswers: correctAnswers,
        userAnswers: answer ? (Array.isArray(answer) ? answer.map((idx) => question.options[idx].text) : [question.options[answer].text]) : [],
        incorrectAnswers: userIncorrectAnswers,
      });
    });

    setScore(totalScore);
    setAnswerSummary(summary);
    setShowSummary(true);

    try {
      const response = await fetch('http://localhost:5000/api/quizzes/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.name, 
          quizId: quizId, 
          quizTopic: quiz.topic,
          score: totalScore,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to store quiz score');
      }
      else{
        console.log("Quiz score stored successfully");
      }
  
      // Handle success if needed
    } catch (error) {
      console.error('Error storing quiz score:', error);
      // Handle error
    }
  };

  const handleAnswerChange = (event) => {
    const { value, checked, type } = event.target;
    const updatedAnswers = [...userAnswers];
    const answerIndex = parseInt(value);

    if (type === 'checkbox') {
      if (!Array.isArray(updatedAnswers[currentQuestionIndex])) {
        updatedAnswers[currentQuestionIndex] = [];
      }

      if (checked) {
        updatedAnswers[currentQuestionIndex].push(answerIndex);
      } else {
        updatedAnswers[currentQuestionIndex] = updatedAnswers[currentQuestionIndex].filter(
          (ans) => ans !== answerIndex
        );
      }
    } else if (type === 'radio') {
      updatedAnswers[currentQuestionIndex] = answerIndex;
    }

    setUserAnswers(updatedAnswers);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  const pageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.1 }
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 0px 8px rgb(255,255,255)" },
    tap: { scale: 0.95 }
  };

  const questionVariants = {
    initial: { x: 300, opacity: 0 },
    in: { x: 0, opacity: 1 },
    out: { x: -300, opacity: 0 }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-blue-900 text-white"
    >
      {!quizStarted && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Welcome to the Quiz!
          </h1>
          <motion.button
            onClick={handleStartQuiz}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline flex items-center justify-center text-xl"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Quiz
          </motion.button>
        </motion.div>
      )}
      {quizStarted && !showSummary && (
        <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">{quiz?.topic}</h1>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Created by: {quiz?.quizCreator}
              </p>
              <p className="text-gray-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Total Questions: {quiz?.questions.length}
              </p>
            </div>
          </motion.div>
          {remainingTime !== null && (
            <motion.div
              className="text-xl font-bold mb-6 text-yellow-400 flex items-center justify-center bg-gray-700 p-3 rounded-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Time Remaining: {formatTime(remainingTime)}
            </motion.div>
          )}
          <AnimatePresence mode="wait">
            {quiz?.questions.map((question, index) => (
              index === currentQuestionIndex && (
                <motion.div
                  key={index}
                  variants={questionVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  transition={{ type: "tween", duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {`Question ${index + 1}`}
                  </h2>
                  <p className="text-gray-300 text-lg mb-4">{question?.questionText}</p>
                  {question?.multiCorrect && (
                    <p className="text-sm font-bold text-yellow-400 flex items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      This question has multiple correct answers.
                    </p>
                  )}
                  <div className="space-y-3 mt-6">
                    {question?.options.map((option, optIndex) => (
                      <motion.label
                        key={optIndex}
                        className="flex items-center bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {question?.multiCorrect ? (
                          <input
                            type="checkbox"
                            value={optIndex}
                            checked={
                              Array.isArray(userAnswers[currentQuestionIndex])
                                ? userAnswers[currentQuestionIndex]?.includes(optIndex)
                                : false
                            }
                            onChange={handleAnswerChange}
                            className="form-checkbox h-5 w-5 text-purple-600"
                          />
                        ) : (
                          <input
                            type="radio"
                            value={optIndex}
                            checked={userAnswers[currentQuestionIndex] === optIndex}
                            onChange={handleAnswerChange}
                            className="form-radio h-5 w-5 text-purple-600"
                          />
                        )}
                        <span className="ml-3 text-gray-300">{option?.text}</span>
                      </motion.label>
                    ))}
                  </div>
                  <div className="flex justify-between mt-8">
                    <motion.button
                      onClick={handlePrevQuestion}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline flex items-center"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      disabled={currentQuestionIndex === 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </motion.button>
                    {currentQuestionIndex < quiz?.questions.length - 1 ? (
                      <motion.button
                        onClick={handleNextQuestion}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline flex items-center"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={handleSubmitQuiz}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline flex items-center"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Submit Quiz
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      )}
{showSummary && (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="w-full max-w-3xl mt-8 bg-gray-800 p-8 rounded-2xl shadow-2xl"
  >
    <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Quiz Summary</h2>
    <div className="flex justify-between items-center mb-8 bg-gray-700 p-4 rounded-lg">
      <p className="text-2xl text-gray-300">Your score: <span className="font-bold text-yellow-400">{score}</span></p>
    
    </div>
    {answerSummary.map((summaryItem, index) => (
      <motion.div
        key={index}
        className="mb-6 bg-gray-700 p-6 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <h3 className="font-bold text-xl text-blue-400 mb-3">{`Question ${index + 1}: ${summaryItem.questionText}`}</h3>
        <p className="mb-2 text-green-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Correct Answer(s): {summaryItem.correctAnswers.join(', ')}
        </p>
        <p className="mb-2 text-yellow-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Your Answer(s): {summaryItem.userAnswers.join(', ')}
        </p>
        {summaryItem.incorrectAnswers.length > 0 && (
          <p className="text-red-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Incorrect Answer(s): {summaryItem.incorrectAnswers.join(', ')}
          </p>
        )}
      </motion.div>
    ))}
  </motion.div>
)}

    </motion.div>
  );
};

export default QuizPage;