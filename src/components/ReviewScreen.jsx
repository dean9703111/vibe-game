import React from 'react';
import { useGame } from '../context/GameContext';

const ReviewScreen = () => {
    const { gradingResult, resetGame } = useGame();

    if (!gradingResult || !gradingResult.details) {
        return (
            <div className="pixel-card">
                <h1>⚠️ 無法載入檢討</h1>
                <p>批改結果不存在</p>
                <button onClick={resetGame}>🔄 重新開始</button>
            </div>
        );
    }

    const { details } = gradingResult;

    return (
        <div className="pixel-card" style={{ maxWidth: '800px', width: '100%' }}>
            <h1>📝 答題檢討</h1>

            <div style={{
                marginTop: '30px',
                textAlign: 'left',
                maxHeight: '60vh',
                overflowY: 'auto',
                padding: '10px'
            }}>
                {details.map((detail, index) => {
                    const isCorrect = detail.isCorrect;

                    return (
                        <div
                            key={index}
                            style={{
                                marginBottom: '25px',
                                padding: '15px',
                                background: isCorrect ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                                border: `2px solid ${isCorrect ? 'var(--pixel-success)' : 'var(--pixel-error)'}`,
                                borderRadius: '8px'
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '10px'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>
                                    {isCorrect ? '✅' : '❌'}
                                </span>
                                <strong>題目 {index + 1}</strong>
                            </div>

                            <div style={{ marginBottom: '10px', lineHeight: '1.6' }}>
                                <strong>問題:</strong> {detail.question}
                            </div>

                            <div style={{ marginLeft: '20px', fontSize: '0.9rem' }}>
                                <div style={{ marginBottom: '5px' }}>
                                    <strong>你的答案:</strong>{' '}
                                    <span style={{
                                        color: isCorrect ? 'var(--pixel-success)' : 'var(--pixel-error)',
                                        fontWeight: 'bold'
                                    }}>
                                        {detail.userAnswer}: {detail['option' + detail.userAnswer]}
                                    </span>
                                </div>

                                {!isCorrect && (
                                    <div style={{ color: 'var(--pixel-success)' }}>
                                        <strong>正確答案:</strong>{' '}
                                        <span style={{ fontWeight: 'bold' }}>
                                            {detail.correctAnswer}: {detail['option' + detail.correctAnswer]}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '30px' }}>
                <button onClick={resetGame}>
                    🔄 重新開始
                </button>
            </div>
        </div>
    );
};

export default ReviewScreen;
