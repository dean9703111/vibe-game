import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const LoginScreen = () => {
    const [input, setInput] = useState('');
    const { startGame, loading, error } = useGame();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            startGame(input.trim());
        }
    };

    return (
        <div className="pixel-card">
            <h1>PIXEL QUIZ</h1>
            <p>Enter your ID to start</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Employee ID"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'LOADING...' : 'START GAME'}
                </button>
            </form>
            {error && <p style={{ color: 'var(--pixel-error)', marginTop: '10px', fontSize: '0.8rem' }}>{error}</p>}
        </div>
    );
};

export default LoginScreen;
