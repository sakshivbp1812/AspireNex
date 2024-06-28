import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/authContext';

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {!quizStarted && (
        <button
          onClick={handleStartQuiz}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Start Quiz
        </button>
      )}
      {quizStarted && !showSummary && (
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-bold mb-8">{quiz?.topic}</h1>
          <p>Created by: {quiz?.quizCreator}</p>
          <p>Total Questions: {quiz?.questions.length}</p>
          {remainingTime !== null && (
            <div className="text-xl font-bold mb-4">
              Time Remaining: {formatTime(remainingTime)}
            </div>
          )}
          {quiz?.questions.map((question, index) => (
            <div key={index} className={index === currentQuestionIndex ? '' : 'hidden'}>
              <h2 className="text-lg font-bold">{`Question ${index + 1}`}</h2>
              <p>{question?.questionText}</p>
              {question?.multiCorrect && (
                <p className="text-sm font-bold text-gray-600">This question has multiple correct answers.</p>
              )}
              <div>
                {question?.options.map((option, optIndex) => (
                  <label key={optIndex} className="flex items-center">
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
                      />
                    ) : (
                      <input
                        type="radio"
                        value={optIndex}
                        checked={userAnswers[currentQuestionIndex] === optIndex}
                        onChange={handleAnswerChange}
                      />
                    )}
                    <span className="ml-2">{option?.text}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={handlePrevQuestion}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
              >
                Previous
              </button>
              {currentQuestionIndex < quiz?.questions.length - 1 && (
                <button
                  onClick={handleNextQuestion}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 ml-2"
                >
                  Next
                </button>
              )}
            </div>
          ))}
          {currentQuestionIndex === quiz?.questions.length - 1 && (
            <button
              onClick={handleSubmitQuiz}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            >
              Submit Quiz
            </button>
          )}
        </div>
      )}
      {showSummary && (
        <div className="w-full max-w-2xl mt-8">
          <h2 className="text-2xl font-bold mb-4">Quiz Summary</h2>
          <p>Your score: {score}</p>
          <p>You are a {score <= 50 ? 'novice' : score <= 80 ? 'intermediate' : 'pro'} in this quiz.</p>
          {answerSummary.map((summaryItem, index) => (
            <div key={index} className="mb-4">
              <p className="font-bold">{`Question ${index + 1}: ${summaryItem.questionText}`}</p>
              <p className="mb-2">Correct Answer(s): {summaryItem.correctAnswers.join(', ')}</p>
              <p className="mb-2">Your Answer(s): {summaryItem.userAnswers.join(', ')}</p>
              {summaryItem.incorrectAnswers.length > 0 && (
                <p className="text-red-500">Incorrect Answer(s): {summaryItem.incorrectAnswers.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizPage;