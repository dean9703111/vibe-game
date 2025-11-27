import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import LoginScreen from './components/LoginScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import ReviewScreen from './components/ReviewScreen';
import LoadingScreen from './components/LoadingScreen';
import './index.css';

const GameContent = () => {
    const { gameState, loading } = useGame();

    // Show loading screen when grading answers
    if (loading && gameState === 'playing') {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}>
                <LoadingScreen />
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            {gameState === 'login' && <LoginScreen />}
            {gameState === 'playing' && <GameScreen />}
            {(gameState === 'gameover' || gameState === 'victory') && <ResultScreen />}
            {gameState === 'review' && <ReviewScreen />}
        </div>
    );
};

function App() {
    return (
        <GameProvider>
            <GameContent />
        </GameProvider>
    );
}

export default App;
