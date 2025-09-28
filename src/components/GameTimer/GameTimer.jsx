import React from 'react';
import styles from './GameTimer.module.css';

const GameTimer = ({ timeRemaining }) => {
    if (!timeRemaining || timeRemaining <= 0) {
        return null;
    }

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getTimeColor = (seconds) => {
        if (seconds <= 60) return 'critical'; // Red when less than 1 minute
        if (seconds <= 300) return 'warning'; // Orange when less than 5 minutes
        return 'normal'; // Green for normal time
    };

    return (
        <div className={`${styles.gameTimer} ${styles[getTimeColor(timeRemaining)]}`}>
            <div className={styles.timerIcon}>⏰</div>
            <div className={styles.timerContent}>
                <div className={styles.timerLabel}>Game Time</div>
                <div className={styles.timerValue}>{formatTime(timeRemaining)}</div>
            </div>
        </div>
    );
};

export default GameTimer;
