import React, { useState, useContext } from 'react';
import { SocketContext, PlayerDataContext } from '../../App';
import Icon from '../Icons/Icons';
import styles from './GameControls.module.css';

const GameControls = ({ gameStarted, isCurrentPlayer, players, gameEnded }) => {
    const socket = useContext(SocketContext);
    const context = useContext(PlayerDataContext);
    const [showDrawModal, setShowDrawModal] = useState(false);
    const [drawOffers, setDrawOffers] = useState({});
    const [gamePaused, setGamePaused] = useState(false);
    const [showQuitModal, setShowQuitModal] = useState(false);
    const [showSurrenderModal, setShowSurrenderModal] = useState(false);

    const handleQuitGame = () => {
        setShowQuitModal(true);
    };

    const confirmQuitGame = () => {
        socket.emit('game:quit', { playerId: context.playerId, roomId: context.roomId });
        setShowQuitModal(false);
    };

    const cancelQuitGame = () => {
        setShowQuitModal(false);
    };

    const handleOfferDraw = () => {
        setShowDrawModal(true);
        socket.emit('game:offerDraw', { 
            playerId: context.playerId, 
            roomId: context.roomId,
            playerName: context.name || 'Player'
        });
    };

    const handleAcceptDraw = () => {
        socket.emit('game:acceptDraw', { playerId: context.playerId, roomId: context.roomId });
        setShowDrawModal(false);
    };

    const handleDeclineDraw = () => {
        socket.emit('game:declineDraw', { playerId: context.playerId, roomId: context.roomId });
        setShowDrawModal(false);
    };

    const handlePauseGame = () => {
        setGamePaused(!gamePaused);
        socket.emit('game:pause', { 
            playerId: context.playerId, 
            roomId: context.roomId,
            paused: !gamePaused 
        });
    };

    const handleSurrender = () => {
        setShowSurrenderModal(true);
    };

    const confirmSurrender = () => {
        socket.emit('game:surrender', { 
            playerId: context.playerId, 
            roomId: context.roomId 
        });
        setShowSurrenderModal(false);
    };

    const cancelSurrender = () => {
        setShowSurrenderModal(false);
    };

    React.useEffect(() => {
        socket.on('game:drawOffered', (data) => {
            setDrawOffers(prev => ({
                ...prev,
                [data.offeringPlayer]: data
            }));
        });

        socket.on('game:drawResponse', (data) => {
            if (data.accepted) {
                setShowDrawModal(false);
            } else {
                setDrawOffers({});
            }
        });

        socket.on('game:paused', (data) => {
            setGamePaused(data.paused);
        });

        return () => {
            socket.off('game:drawOffered');
            socket.off('game:drawResponse');
            socket.off('game:paused');
        };
    }, [socket]);

    if (!gameStarted || gameEnded) {
        return null;
    }

    return (
        <>
            <div className={styles.gameControls}>
                <div className={styles.controlGroup}>
                    <button 
                        className={`${styles.controlBtn} ${styles.quitBtn}`}
                        onClick={handleQuitGame}
                        title="Quit Game (Ends for all players)"
                    >
                        <Icon name="exit" size={16} className="inline-block mr-2" />
                        Quit
                    </button>
                    
                    <button 
                        className={`${styles.controlBtn} ${styles.drawBtn}`}
                        onClick={handleOfferDraw}
                        title="Offer Draw"
                    >
                        <Icon name="handshake" size={16} className="inline-block mr-2" />
                        Draw
                    </button>
                    
                    <button 
                        className={`${styles.controlBtn} ${styles.pauseBtn}`}
                        onClick={handlePauseGame}
                        title={gamePaused ? "Resume Game" : "Pause Game"}
                    >
                        {gamePaused ? (
                            <>
                                <Icon name="play" size={16} className="inline-block mr-2" />
                                Resume
                            </>
                        ) : (
                            <>
                                <Icon name="pause" size={16} className="inline-block mr-2" />
                                Pause
                            </>
                        )}
                    </button>
                    
                    <button 
                        className={`${styles.controlBtn} ${styles.surrenderBtn}`}
                        onClick={handleSurrender}
                        title="Surrender (You lose)"
                    >
                        <Icon name="flag" size={16} className="inline-block mr-2" />
                        Surrender
                    </button>
                </div>

                {gamePaused && (
                    <div className={styles.pauseIndicator}>
                        <span className={styles.pauseText}>Game Paused</span>
                    </div>
                )}
            </div>

            {showDrawModal && (
                <div className={styles.drawModal}>
                    <div className={styles.drawModalContent}>
                        <h3>🤝 Draw Offer Sent</h3>
                        <p>You have offered a draw to all players. Waiting for their response...</p>
                        <div className={styles.drawModalActions}>
                            <button onClick={handleDeclineDraw} className={styles.declineBtn}>
                                Cancel Offer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {Object.keys(drawOffers).length > 0 && (
                <div className={styles.drawModal}>
                    <div className={styles.drawModalContent}>
                        <h3>🤝 Draw Offer Received</h3>
                        <p><strong>{drawOffers[Object.keys(drawOffers)[0]]?.offeringPlayer}</strong> has offered a draw. Do you want to accept?</p>
                        <div className={styles.drawModalActions}>
                            <button onClick={handleAcceptDraw} className={styles.acceptBtn}>
                                ✅ Accept Draw
                            </button>
                            <button onClick={handleDeclineDraw} className={styles.declineBtn}>
                                ❌ Decline
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showQuitModal && (
                <div className={styles.drawModal}>
                    <div className={styles.drawModalContent}>
                        <h3>⚠️ Quit Game?</h3>
                        <p>Are you sure you want to quit the game? This will end the game for <strong>all players</strong> and cannot be undone.</p>
                        <div className={styles.drawModalActions}>
                            <button onClick={confirmQuitGame} className={styles.declineBtn}>
                                🚪 Yes, Quit Game
                            </button>
                            <button onClick={cancelQuitGame} className={styles.acceptBtn}>
                                ❌ Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSurrenderModal && (
                <div className={styles.drawModal}>
                    <div className={styles.drawModalContent}>
                        <h3>🏳️ Surrender Game?</h3>
                        <p>Are you sure you want to surrender? You will <strong>lose the game</strong> and cannot undo this action.</p>
                        <div className={styles.drawModalActions}>
                            <button onClick={confirmSurrender} className={styles.declineBtn}>
                                🏳️ Yes, Surrender
                            </button>
                            <button onClick={cancelSurrender} className={styles.acceptBtn}>
                                ❌ Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GameControls;