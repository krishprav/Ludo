import React, { useState, useEffect, useMemo } from 'react';
const WinnerOverlay = React.memo(({ winner, finalScores = {}, onPlayAgain }) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        if (winner) {
            const timer = setTimeout(() => {
                setShowOverlay(true);
            }, 500);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [winner]);

    const handlePlayAgain = () => {
        setIsAnimating(false);
        setTimeout(() => {
            if (onPlayAgain) {
                onPlayAgain();
            }
        }, 300);
    };

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            window.location.href = '/';
        }, 300);
    };

    const handleExitToLobby = () => {
        setIsAnimating(false);
        setTimeout(() => {
            if (onPlayAgain) {
                onPlayAgain();
            }
        }, 300);
    };

    const sortedPlayers = useMemo(() => {
        return Object.values(finalScores).sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return b.captures - a.captures;
        });
    }, [finalScores]);

    const winnerStats = useMemo(() => {
        if (!winner || !finalScores[winner]) return null;
        
        const stats = finalScores[winner];
        return {
            score: stats.score || 0,
            captures: stats.captures || 0,
            rank: sortedPlayers.findIndex(p => p.color === winner) + 1,
            totalPlayers: sortedPlayers.length
        };
    }, [winner, finalScores, sortedPlayers]);

    const getPlayerColorClass = (color) => {
        const colorMap = {
            red: 'bg-game-red',
            blue: 'bg-game-blue',
            green: 'bg-game-green',
            yellow: 'bg-game-yellow',
        };
        return colorMap[color.toLowerCase()] || 'bg-game-gray';
    };

    const getRankBadge = (index) => {
        const badges = {
            0: { emoji: '🥇', class: 'bg-yellow-400 text-yellow-900' },
            1: { emoji: '🥈', class: 'bg-gray-300 text-gray-800' },
            2: { emoji: '🥉', class: 'bg-orange-400 text-orange-900' },
        };
        return badges[index] || { emoji: `${index + 1}`, class: 'bg-gray-200 text-gray-700' };
    };

    const PlayerStanding = React.memo(({ player, index }) => {
        const isWinner = player.color === winner;
        const rankBadge = getRankBadge(index);

        return (
            <div 
                className={`
                    flex items-center justify-between p-5 rounded-2xl
                    transition-all duration-500 ease-in-out
                    ${isWinner 
                        ? 'bg-gradient-to-r from-yellow-500/20 via-yellow-400/20 to-yellow-500/20 border-2 border-yellow-400/50 shadow-2xl scale-105 transform' 
                        : 'bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 hover:shadow-xl border border-white/20'
                    }
                    backdrop-blur-sm
                `}
                role="row"
                aria-label={`${player.color} player: ${player.score} points, ${player.captures} captures`}
            >
                <div className="flex items-center space-x-4">
                    <div className={`
                        w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                        font-bold text-lg
                        ${rankBadge.class}
                        shadow-lg border-2 border-white
                        ${isWinner ? 'animate-pulse' : ''}
                    `}>
                        {rankBadge.emoji}
                    </div>

                    <div 
                        className={`
                            w-8 h-8 sm:w-9 sm:h-9 rounded-full border-3 border-white
                            ${getPlayerColorClass(player.color)}
                            shadow-lg
                            ${isWinner ? 'ring-2 ring-yellow-400' : ''}
                        `}
                        aria-label={`${player.color} player`}
                    />

                    <div className="flex flex-col">
                        <span className="font-bold text-white text-base sm:text-lg">
                            {player.playerName || player.color.charAt(0).toUpperCase() + player.color.slice(1)}
                        </span>
                        <span className="text-xs text-gray-300 font-medium">
                            {player.color.charAt(0).toUpperCase() + player.color.slice(1)} Player
                        </span>
                        {isWinner && (
                            <span className="text-sm text-yellow-300 font-bold flex items-center gap-1 mt-1">
                                👑
                                WINNER
                            </span>
                        )}
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                        {player.score || 0} pts
                    </div>
                    <div className="text-sm text-gray-300 font-medium">
                        {player.captures || 0} captures
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        Rank #{index + 1}
                    </div>
                </div>
            </div>
        );
    });

    if (!showOverlay || !winner) return null;

    return (
        <div 
            className={`
                fixed inset-0 z-[100] flex items-center justify-center
                bg-gradient-to-br from-black/80 via-black/70 to-black/80 
                backdrop-blur-md
                transition-all duration-700 ease-in-out
                ${isAnimating ? 'opacity-100' : 'opacity-0'}
            `}
            role="dialog"
            aria-modal="true"
            aria-labelledby="winner-title"
        >
            <div 
                className={`
                    w-full max-w-lg mx-4 sm:max-w-xl
                    bg-gradient-to-br from-white/10 via-white/5 to-white/10
                    backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20
                    transform transition-all duration-700 ease-out
                    ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
                    relative overflow-hidden
                    before:absolute before:inset-0 before:bg-gradient-to-br 
                    before:from-white/10 before:via-white/5 before:to-white/10
                    before:pointer-events-none
                `}
            >
                <button
                    onClick={handleClose}
                    className="
                        absolute top-6 right-6 z-10
                        w-10 h-10 rounded-full
                        bg-white/20 hover:bg-white/30
                        shadow-lg hover:shadow-xl
                        flex items-center justify-center
                        transition-all duration-300 ease-in-out
                        hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/30
                        text-white hover:text-gray-200
                        backdrop-blur-sm border border-white/30
                    "
                    aria-label="Close overlay"
                    title="Close and return to home"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="text-center py-12 px-8">
                    <div className="relative mb-6">
                        <div className="text-7xl sm:text-9xl mb-4 animate-bounce-slow filter drop-shadow-2xl">
                            🏆
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                    </div>
                    
                    <h2 
                        id="winner-title"
                        className="text-3xl sm:text-4xl font-bold text-white mb-3 
                               bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
                    >
                        {winner === 'draw' ? 'Game Draw!' : 
                         winner === 'quit' ? 'Game Ended' : 
                         winner === 'surrender' ? 'Game Ended' : 
                         'Game Over!'}
                    </h2>
                    
                    {winner !== 'draw' && winner !== 'quit' && winner !== 'surrender' && (
                        <div className="text-2xl sm:text-3xl font-bold mb-6 text-yellow-300
                                     drop-shadow-sm">
                            {finalScores[winner]?.playerName || winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!
                        </div>
                    )}

                    {winnerStats && (
                        <div className="flex justify-center space-x-8 mb-8">
                            <div className="text-center bg-gradient-to-br from-blue-500/20 to-blue-600/20 
                                         rounded-2xl px-6 py-4 shadow-lg border border-blue-400/30
                                         backdrop-blur-sm">
                                <div className="text-3xl sm:text-4xl font-bold text-blue-300 mb-1">
                                    {winnerStats.score}
                                </div>
                                <div className="text-sm font-medium text-blue-200">
                                    Points
                                </div>
                            </div>
                            <div className="text-center bg-gradient-to-br from-green-500/20 to-green-600/20 
                                         rounded-2xl px-6 py-4 shadow-lg border border-green-400/30
                                         backdrop-blur-sm">
                                <div className="text-3xl sm:text-4xl font-bold text-green-300 mb-1">
                                    {winnerStats.captures}
                                </div>
                                <div className="text-sm font-medium text-green-200">
                                    Captures
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-8 pb-8">
                    <div className="border-t border-white/20 pt-6">
                        <h3 className="text-xl font-bold text-white mb-6 text-center">
                            Final Standings
                        </h3>
                        
                        <div className="space-y-4">
                            {sortedPlayers.length > 0 ? (
                                sortedPlayers.map((player, index) => (
                                    <PlayerStanding
                                        key={player.color}
                                        player={player}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 text-lg mb-4">
                                        📊 Loading final scores...
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                        Final standings will appear here
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-8 pb-8 space-y-4">
                    <button
                        onClick={handlePlayAgain}
                        className="
                            w-full py-4 px-8
                            bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                            hover:from-blue-600 hover:via-blue-700 hover:to-blue-800
                            text-white font-bold text-lg
                            rounded-2xl shadow-xl
                            transition-all duration-300 ease-in-out
                            hover:shadow-2xl hover:scale-105
                            active:scale-95
                            focus:outline-none focus:ring-4 focus:ring-blue-500/30
                            border border-blue-400/20
                            backdrop-blur-sm
                        "
                        aria-label="Play again"
                    >
                        <span className="flex items-center justify-center gap-3">
                            🔄
                            Play Again
                        </span>
                    </button>
                    
                    <button
                        onClick={handleExitToLobby}
                        className="
                            w-full py-4 px-8
                            bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600
                            hover:from-gray-500 hover:via-gray-600 hover:to-gray-700
                            text-white font-bold text-lg
                            rounded-2xl shadow-xl
                            transition-all duration-300 ease-in-out
                            hover:shadow-2xl hover:scale-105
                            active:scale-95
                            focus:outline-none focus:ring-4 focus:ring-gray-500/30
                            border border-gray-400/20
                            backdrop-blur-sm
                        "
                        aria-label="Exit to lobby"
                    >
                        <span className="flex items-center justify-center gap-3">
                            🏠
                            Exit to Lobby
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
});

WinnerOverlay.displayName = 'WinnerOverlay';

export default WinnerOverlay;