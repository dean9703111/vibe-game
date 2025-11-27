import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchQuestions, submitResult } from '../services/googleSheetService';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState('login'); // login, loading, playing, result, review
    const [userId, setUserId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]); // Store user's selections only
    const [gradingResult, setGradingResult] = useState(null); // Store server grading result
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const startGame = async (id) => {
        setLoading(true);
        setUserId(id);
        try {
            const allQuestions = await fetchQuestions();
            // Randomize and pick N questions
            const count = parseInt(import.meta.env.VITE_QUESTION_COUNT) || 5;
            const shuffled = allQuestions.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, count);

            setQuestions(selected);
            setCurrentQuestionIndex(0);
            setUserAnswers([]);
            setGradingResult(null);
            setScore(0);
            setCorrectCount(0);
            setGameState('playing');
        } catch (err) {
            setError('Failed to load questions. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const answerQuestion = (selectedOption) => {
        const currentQuestion = questions[currentQuestionIndex];

        // Record only the user's answer (no validation on client side)
        const newAnswer = {
            questionId: currentQuestion['題號'] || String(currentQuestionIndex + 1),
            userAnswer: selectedOption
        };

        setUserAnswers(prev => [...prev, newAnswer]);

        // Move to next question or finish
        if (currentQuestionIndex + 1 >= questions.length) {
            // All questions answered, send to backend for grading
            finishGame([...userAnswers, newAnswer]);
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const finishGame = async (allAnswers) => {
        setLoading(true);

        try {
            // Submit to backend for grading
            const result = await submitResult({
                action: 'grade',
                userId: userId,
                answers: allAnswers
            });

            console.log('Grading result:', result);

            if (result.status === 'success') {
                setGradingResult(result);
                setScore(result.score);
                setCorrectCount(result.correctCount);
                setGameState(result.passed ? 'victory' : 'gameover');
            } else {
                setError('Failed to grade answers: ' + result.message);
                setGameState('gameover');
            }
        } catch (err) {
            console.error('Error grading answers:', err);
            setError('Failed to submit answers. Please try again.');
            setGameState('gameover');
        } finally {
            setLoading(false);
        }
    };

    const showReview = () => {
        setGameState('review');
    };

    const resetGame = () => {
        setGameState('login');
        setUserId('');
        setQuestions([]);
        setUserAnswers([]);
        setGradingResult(null);
        setScore(0);
        setCorrectCount(0);
        setCurrentQuestionIndex(0);
        setError(null);
    };

    return (
        <GameContext.Provider value={{
            gameState,
            userId,
            questions,
            currentQuestionIndex,
            userAnswers,
            gradingResult,
            score,
            correctCount,
            loading,
            error,
            startGame,
            answerQuestion,
            showReview,
            resetGame
        }}>
            {children}
        </GameContext.Provider>
    );
};
