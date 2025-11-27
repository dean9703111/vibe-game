import React from 'react';
import { useGame } from '../context/GameContext';

const ResultScreen = () => {
    const { gameState, score, correctCount, questions, resetGame, showReview } = useGame();
    const isVictory = gameState === 'victory';
    const totalQuestions = questions.length;
    const passThreshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD) || 3;

    return (
        <div className="pixel-card">
            <h1 style={{ color: isVictory ? 'var(--pixel-success)' : 'var(--pixel-error)' }}>
                {isVictory ? '🎉 通過！' : '😢 未通過'}
            </h1>

            <div style={{ margin: '30px 0', fontSize: '1.3rem', lineHeight: '1.8' }}>
                <div>答對題數: <strong>{correctCount} / {totalQuestions}</strong></div>
                <div style={{ fontSize: '1rem', color: 'var(--pixel-text-secondary)', marginTop: '10px' }}>
                    通過標準: {passThreshold} 題
                </div>
                <div style={{ fontSize: '1.5rem', marginTop: '20px' }}>
                    總分: <strong>{score}</strong> 分
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <button onClick={showReview} style={{ background: 'var(--pixel-info)' }}>
                    📝 查看檢討
                </button>
                <button onClick={resetGame}>
                    🔄 重新開始
                </button>
            </div>
        </div>
    );
};

export default ResultScreen;
