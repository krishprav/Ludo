import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { SocketContext } from '../../App';

const Scoreboard = React.memo(() => {
    const [scores, setScores] = useState({});
    const [previousScores, setPreviousScores] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const socket = useContext(SocketContext);

    /**
     * Handle incoming score updates from WebSocket
     * Debounced to prevent excessive re-renders
     */
    const handleScoreUpdate = useCallback((scoresData) => {
        setPreviousScores(scores);
        setScores(scoresData);
        setIsVisible(true);
    }, [scores]);

    /**
     * Toggle scoreboard visibility
     */
    const toggleScoreboard = useCallback(() => {
        setIsMinimized(!isMinimized);
    }, [isMinimized]);

    /**
     * Set up WebSocket listeners
     */
    useEffect(() => {
        if (socket) {
            socket.on('game:scores', handleScoreUpdate);

            return () => {
                socket.off('game:scores');
            };
        }
    }, [socket, handleScoreUpdate]);

    /**
     * Memoized sorted players for performance optimization
     */
    const sortedPlayers = useMemo(() => {
        return Object.values(scores).sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return b.captures - a.captures;
        });
    }, [scores]);

    /**
     * Get score change indicator for smooth animations
     */
    const getScoreChange = useCallback((playerColor) => {
        const current = scores[playerColor]?.score || 0;
        const previous = previousScores[playerColor]?.score || 0;
        return current - previous;
    }, [scores, previousScores]);


    /**
     * Render individual player score row
     */
    const PlayerScoreRow = React.memo(({ player, index, isLeading }) => {
        const scoreChange = getScoreChange(player.color);
        const [showScoreChange, setShowScoreChange] = useState(false);
        
        useEffect(() => {
            if (scoreChange > 0) {
                setShowScoreChange(true);
                const timer = setTimeout(() => setShowScoreChange(false), 2000);
                return () => clearTimeout(timer);
            }
        }, [scoreChange]);
        
        const leadingScore = sortedPlayers[0]?.score || 1;
        const progressPercentage = (player.score / leadingScore) * 100;
        
        return (
            <div 
                className={`score-row ${isLeading ? 'leading' : ''} ${scoreChange > 0 ? 'updated' : ''}`}
                role="row"
                aria-label={`${player.color} player score: ${player.score} points`}
            >
                <div className="player-info">
                    <div className="rank-badge">
                        #{index + 1}
                    </div>
                    
                    <div className="color-indicator-wrapper">
                        <div 
                            className={`color-indicator ${player.color.toLowerCase()}`}
                            aria-label={`${player.color} player`}
                        />
                        {isLeading && <div className="color-glow"></div>}
                    </div>
                    
                    <div className="player-details">
                        <div className="player-name-section">
                            <span className="player-name">
                                {player.color.charAt(0).toUpperCase() + player.color.slice(1)}
                            </span>
                            {isLeading && (
                                <span 
                                    className="crown"
                                    role="img"
                                    aria-label="Leader crown"
                                >
                                    👑
                                </span>
                            )}
                        </div>
                        <div className="player-stats">
                            <span className="capture-count">
                                🎯 {player.captures} captures
                            </span>
                        </div>
                    </div>
                </div>

                <div className="score-section">
                    <div className="score-display">
                        <span className="score">
                            {player.score}
                        </span>
                        <span className="score-unit">pts</span>
                        {showScoreChange && scoreChange > 0 && (
                            <div 
                                className="score-change-badge"
                                role="img"
                                aria-label={`Gained ${scoreChange} points`}
                            >
                                +{scoreChange}
                            </div>
                        )}
                    </div>
                    
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div 
                                className={`progress-fill ${player.color.toLowerCase()}`}
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                            <div className="progress-shine"></div>
                        </div>
                        <div className="progress-label">
                            {progressPercentage.toFixed(0)}% of leader
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    if (!isVisible || Object.keys(scores).length === 0) {
        return (
            <div className="scoreboard">
                <div className="scoreboard-header">
                    <h3 className="scoreboard-title">
                        🏆 Live Scores
                    </h3>
                </div>
                <div className="scoreboard-content">
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            border: '3px solid rgba(255,255,255,0.3)',
                            borderTop: '3px solid #ffffff',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 12px'
                        }}></div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 }}>
                            Waiting for game to start...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div 
                className={`scoreboard ${isMinimized ? 'hidden' : ''}`}
                role="region"
                aria-label="Live game scores"
            >
                <div className="scoreboard-header">
                    <div className="header-content">
                        <h3 className="scoreboard-title">
                            🏆 Live Scores
                        </h3>
                        <div className="live-indicator">
                            <div className="pulse-dot"></div>
                            <span>LIVE</span>
                        </div>
                    </div>
                    <button
                        onClick={toggleScoreboard}
                        className="scoreboard-close"
                        aria-label="Hide scoreboard"
                    >
                        ×
                    </button>
                </div>

                <div className="scoreboard-content">
                    {sortedPlayers.map((player, index) => (
                        <PlayerScoreRow
                            key={player.color}
                            player={player}
                            index={index}
                            isLeading={index === 0}
                        />
                    ))}
                </div>

                <div className="scoreboard-footer">
                    <div className="footer-content">
                        <small>⚡ Real-time updates</small>
                        <div className="total-players">
                            {sortedPlayers.length} players
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

Scoreboard.displayName = 'Scoreboard';

export default Scoreboard;