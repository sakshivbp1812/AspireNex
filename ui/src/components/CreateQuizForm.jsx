import { useState } from 'react';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateQuizForm = () => {
  const [quizCreator, setQuizCreator] = useState('');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      // Reset form or redirect as needed
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
      currentQuestion.questionText.trim() !== '' &&
      currentQuestion.options.every(option => option.trim() !== '') &&
      currentQuestion.correctOption.length > 0
    );
  };

  const clearAllQuestions = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
  };

  return (
    <>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Quiz Created By</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={quizCreator}
            onChange={(e) => setQuizCreator(e.target.value)}
            placeholder="Quiz Creator Name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Topic</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Quiz Topic"
            required
          />
        </div>
        <hr className="my-4" />
        {questions.map((question, index) => (
          <div key={index} className={index === currentQuestionIndex ? '' : 'hidden'}>
            <label className="block text-gray-700 text-sm font-bold mb-2">Question {index + 1}</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              type="text"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
              placeholder="Question Text"
              required
            />
            <div className="grid grid-cols-2 gap-4 mb-2">
              {question.options.map((option, optIndex) => (
                <input
                  key={optIndex}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  value={option}
                  onChange={(e) => handleQuestionChange(index, 'options', { index: optIndex, value: e.target.value })}
                  placeholder={`Option ${optIndex + 1}`}
                  required
                />
              ))}
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Correct Option</label>
              <div>
                {question.options.map((option, optIndex) => (
                  <label key={optIndex} className="flex items-center">
                    <input
                      type={question.multiCorrect ? "checkbox" : "radio"}
                      checked={question.correctOption.includes(optIndex)}
                      onChange={() => handleCorrectOptionChange(index, optIndex)}
                      className="mr-2 leading-tight"
                    />
                    <span className="text-gray-700">{`Option ${optIndex + 1}`}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Allow Multiple Correct Answers?</label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={question.multiCorrect}
                  onChange={(e) => handleMultiCorrectChange(index, e.target.checked)}
                  className="mr-2 leading-tight"
                />
                <span className="text-gray-700">Allow multiple correct answers</span>
              </label>
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Difficulty Level</label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={question.difficulty}
                onChange={(e) => handleDifficultyChange(index, e.target.value)}
                required
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Time Limit (seconds)</label>
              <input
                className="shadow appearance-none border rounded w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                value={question.timeLimit}
                onChange={(e) => handleTimeLimitChange(index, e.target.value)}
                min="10"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => clearQuestion(index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            >
              Clear Question
            </button>
          </div>
        ))}
        <div className="flex justify-between mt-4">
          {currentQuestionIndex > 0 && (
            <button
              type="button"
              onClick={handlePreviousQuestion}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Previous
            </button>
          )}
          {currentQuestionIndex < questions.length && (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={!isFormValid()}
            >
              Next
            </button>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleQuestionAdd}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Question
          </button>
          <button
            type="button"
            onClick={handleOpenModal}
            className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Preview
          </button>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Quiz Preview"
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
          <h2 className="text-2xl font-bold mb-4">Quiz Preview</h2>
          <p><strong>Quiz Creator:</strong> {quizCreator}</p>
          <p><strong>Topic:</strong> {topic}</p>
          <hr className="my-4" />
          {questions.map((question, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold">Question {index + 1}</h3>
              <p>{question.questionText}</p>
              <div>
                {question.options.map((option, optIndex) => (
                  <p key={optIndex} className={question.correctOption.includes(optIndex) ? 'text-green-600' : ''}>
                    {`Option ${optIndex + 1}: ${option}`}
                  </p>
                ))}
              </div>
              <p><strong>Difficulty:</strong> {question.difficulty}</p>
              <p><strong>Time Limit:</strong> {question.timeLimit} seconds</p>
              {question.multiCorrect && <p className="text-red-500">Multiple correct answers allowed</p>}
            </div>
          ))}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
            <button
              onClick={handleCloseModal}
              className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Discard
            </button>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default CreateQuizForm;
