import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
    return (
        <div className="pixel-card">
            <h1>📝 批改中...</h1>

            <div className="grading-animation">
                <div className="paper">
                    <div className="paper-lines"></div>
                    <div className="paper-lines"></div>
                    <div className="paper-lines"></div>
                    <div className="paper-lines"></div>
                    <div className="paper-lines"></div>
                </div>

                <div className="pen">✏️</div>

                <div className="check-marks">
                    <span className="check-mark">✓</span>
                    <span className="check-mark">✓</span>
                    <span className="check-mark">✓</span>
                </div>
            </div>

            <p style={{
                marginTop: '30px',
                fontSize: '0.9rem',
                color: 'var(--pixel-text-secondary)',
                animation: 'pulse 1.5s ease-in-out infinite'
            }}>
                正在計算分數...
            </p>
        </div>
    );
};

export default LoadingScreen;
