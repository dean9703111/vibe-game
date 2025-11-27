import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { getBossImage } from '../services/diceBearService';

const GameScreen = () => {
    const { questions, currentQuestionIndex, answerQuestion } = useGame();
    const [bossUrl, setBossUrl] = useState('');
    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        // Generate a new boss for each question based on question content or index
        setBossUrl(getBossImage(`boss-${currentQuestionIndex}-${currentQuestion?.['題目']}`));
        if (currentQuestion) {
            console.log("CHEAT SHEET - Correct Answer:", currentQuestion['解答']);
        }
    }, [currentQuestionIndex, currentQuestion]);

    if (!currentQuestion) return <div>Loading...</div>;

    return (
        <div className="pixel-card">
            <div className="health-bar" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                題目 {currentQuestionIndex + 1} / {questions.length}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={bossUrl} alt="Boss" className="boss-image" />
            </div>

            <h2 style={{ fontSize: '1rem', lineHeight: '1.5', marginBottom: '20px' }}>
                {currentQuestion['題目']}
            </h2>

            <div className="options-grid">
                {['A', 'B', 'C', 'D'].map((opt) => (
                    <button
                        key={opt}
                        className="option-btn"
                        onClick={() => answerQuestion(opt)}
                    >
                        {opt}: {currentQuestion[opt]}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GameScreen;
