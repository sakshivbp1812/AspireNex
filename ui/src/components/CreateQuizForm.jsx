// components/CreateQuizForm.js
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateQuizForm = () => {
  const [quizCreator, setQuizCreator] = useState('');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
  };

  const handleQuestionAdd = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctOption: [],
        multiCorrect: false,
        difficulty: 'medium',
        timeLimit: 30
      }
    ]);
    setCurrentQuestionIndex(questions.length);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === 'options') {
      updatedQuestions[index].options[value.index] = value.value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (index, optionIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[index].multiCorrect) {
      const correctOptions = updatedQuestions[index].correctOption;
      if (correctOptions.includes(optionIndex)) {
        updatedQuestions[index].correctOption = correctOptions.filter(opt => opt !== optionIndex);
      } else {
        updatedQuestions[index].correctOption = [...correctOptions, optionIndex];
      }
    } else {
      updatedQuestions[index].correctOption = [optionIndex];
    }
    setQuestions(updatedQuestions);
  };

  const handleMultiCorrectChange = (index, checked) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].multiCorrect = checked;
    if (!checked) {
      updatedQuestions[index].correctOption = updatedQuestions[index].correctOption.length > 0
        ? [updatedQuestions[index].correctOption[0]]
        : [];
    }
    setQuestions(updatedQuestions);
  };

  const handleDifficultyChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].difficulty = value;
    setQuestions(updatedQuestions);
  };

  const handleTimeLimitChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].timeLimit = parseInt(value, 10);
    setQuestions(updatedQuestions);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const quizData = {
      quizCreator,
      topic,
      questions: questions.map(question => ({
        questionText: question.questionText,
        options: question.options.map((option, index) => ({
          text: option,
          isCorrect: question.correctOption.includes(index)
        })),
        multiCorrect: question.multiCorrect,
        difficulty: question.difficulty,
        timeLimit: question.timeLimit
      }))
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }
  
      const data = await response.json();
      console.log('Quiz created successfully:', data);
      toast.success('Quiz created successfully!');
      setQuizCreator('');
      setTopic('');
      setQuestions([]);
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create quiz.');
    }
  };

  const isFormValid = () => {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      currentQuestion &&
      currentQuestion.questionText.trim() !== '' &&
      currentQuestion.options.every(option => option.trim() !== '') &&
      currentQuestion.correctOption.length > 0
    );
  };
  return (
    <>
     <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
     <form className="space-y-8">
      <motion.div variants={formVariants} initial="hidden" animate="visible" className="bg-gray-800 rounded-lg p-6">
        <label className="block text-purple-400 text-sm font-bold mb-2">Quiz Creator</label>
        <div className="flex items-center bg-gray-700 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <input
            className="w-full bg-gray-700 text-white rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600"
            type="text"
            value={quizCreator}
            onChange={(e) => setQuizCreator(e.target.value)}
            placeholder="Your Name"
            required
          />
        </div>
      </motion.div>

      <motion.div variants={formVariants} initial="hidden" animate="visible" className="bg-gray-800 rounded-lg p-6">
        <label className="block text-purple-400 text-sm font-bold mb-2">Topic</label>
        <div className="flex items-center bg-gray-700 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <input
            className="w-full bg-gray-700 text-white rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Quiz Topic"
            required
          />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {questions.map((question, index) => (
          index === currentQuestionIndex && (
            <motion.div
              key={index}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-gray-800 rounded-lg p-6 space-y-6"
            >
              <h2 className="text-2xl font-bold text-purple-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Question {index + 1}
              </h2>
              <input
                className="w-full bg-gray-700 text-white rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600"
                type="text"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                placeholder="Question Text"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center bg-gray-700 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <input
                      className="w-full bg-gray-700 text-white rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600"
                      type="text"
                      value={option}
                      onChange={(e) => handleQuestionChange(index, 'options', { index: optIndex, value: e.target.value })}
                      placeholder={`Option ${optIndex + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-purple-400 text-sm font-bold mb-2">Correct Option(s)</label>
                <div className="flex flex-wrap gap-4">
                  {question.options.map((_, optIndex) => (
                    <label key={optIndex} className="flex items-center space-x-2 bg-gray-700 p-2 rounded-lg">
                      <input
                        type={question.multiCorrect ? "checkbox" : "radio"}
                        checked={question.correctOption.includes(optIndex)}
                        onChange={() => handleCorrectOptionChange(index, optIndex)}
                        className="form-checkbox h-5 w-5 text-purple-600"
                      />
                      <span className="text-gray-300">Option {optIndex + 1}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center bg-gray-700 p-3 rounded-lg">
                <input
                  type="checkbox"
                  checked={question.multiCorrect}
                  onChange={(e) => handleMultiCorrectChange(index, e.target.checked)}
                  className="form-checkbox h-5 w-5 text-purple-600"
                />
                <span className="ml-2 text-gray-300">Allow multiple correct answers</span>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-purple-400 text-sm font-bold mb-2">Difficulty</label>
                  <div className="flex items-center bg-gray-700 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <select
                      className="w-full bg-gray-700 text-white rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600"
                      value={question.difficulty}
                      onChange={(e) => handleDifficultyChange(index, e.target.value)}
                      required
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-purple-400 text-sm font-bold mb-2">Time Limit (seconds)</label>
                  <div className="flex items-center bg-gray-700 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <input
                      className="w-full bg-gray-700 text-white rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600"
                      type="number"
                      value={question.timeLimit}
                      onChange={(e) => handleTimeLimitChange(index, e.target.value)}
                      min="10"
                      required
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          type="button"
          onClick={handlePreviousQuestion}
          className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline flex items-center"
          disabled={currentQuestionIndex === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </motion.button>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          type="button"
          onClick={handleNextQuestion}
          className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline flex items-center"
          disabled={currentQuestionIndex === questions.length - 1 || !isFormValid()}
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          type="button"
          onClick={handleQuestionAdd}
          className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Question
        </motion.button>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          type="button"
          onClick={handleOpenModal}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </motion.button>
      </div>
    </form>
  
    <AnimatePresence>
  {isModalOpen && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800 p-8 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h2 className="text-3xl font-bold text-purple-400 mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Quiz Preview
        </h2>
        <div className="space-y-4 mb-6">
          <p className="text-gray-300"><span className="font-bold">Quiz Creator:</span> {quizCreator}</p>
          <p className="text-gray-300"><span className="font-bold">Topic:</span> {topic}</p>
        </div>
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-purple-400 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Question {index + 1}
              </h3>
              <p className="text-white mb-2">{question.questionText}</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {question.options.map((option, optIndex) => (
                  <p 
                    key={optIndex} 
                    className={`p-2 rounded flex items-center ${question.correctOption.includes(optIndex) 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-600 text-gray-300'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {option}
                  </p>
                ))}
              </div>
              <p className="text-gray-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-bold">Difficulty:</span> {question.difficulty}
              </p>
              <p className="text-gray-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold">Time Limit:</span> {question.timeLimit} seconds
              </p>
              {question.multiCorrect && (
                <p className="text-yellow-400 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Multiple correct answers allowed
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6 space-x-4">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleSubmit}
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Submit Quiz
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleCloseModal}
            className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close Preview
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  
     
    </>
  );
};

export default CreateQuizForm;