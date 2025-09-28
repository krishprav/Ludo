const calculatePlayerScore = (pawns, playerColor) => {
    const playerPawns = pawns.filter(pawn => pawn.color === playerColor);
    return playerPawns.reduce((total, pawn) => total + pawn.score, 0);
};

const getAllPlayerScores = (room) => {
    const scores = {};
    room.players.forEach(player => {
        scores[player.color] = calculatePlayerScore(room.pawns, player.color);
    });
    return scores;
};

const updatePawnScoreAfterMove = (pawn, stepsMoved) => {
    pawn.updateScore(stepsMoved);
};

const handleCaptureScoring = (strikerPawn, victimPawn) => {
    strikerPawn.score += victimPawn.score;
    victimPawn.resetScore();
};

const getPlayerCaptureCount = (pawns, playerColor) => {
    const playerPawns = pawns.filter(pawn => pawn.color === playerColor);
    const totalScore = playerPawns.reduce((total, pawn) => total + pawn.score, 0);
    return Math.floor(totalScore / 10);
};

const determineWinner = (room) => {
    const scores = getAllPlayerScores(room);
    const maxScore = Math.max(...Object.values(scores));
    
    const topPlayers = Object.keys(scores).filter(color => scores[color] === maxScore);
    
    if (topPlayers.length === 1) {
        return topPlayers[0];
    }
    
    let winner = topPlayers[0];
    let maxCaptures = getPlayerCaptureCount(room.pawns, winner);
    
    for (let i = 1; i < topPlayers.length; i++) {
        const captures = getPlayerCaptureCount(room.pawns, topPlayers[i]);
        if (captures > maxCaptures) {
            winner = topPlayers[i];
            maxCaptures = captures;
        }
    }
    
    return winner;
};

const formatScoresForClient = (room) => {
    const scores = {};
    room.players.forEach(player => {
        scores[player.color] = {
            playerName: player.name,
            color: player.color,
            score: calculatePlayerScore(room.pawns, player.color),
            captures: getPlayerCaptureCount(room.pawns, player.color)
        };
    });
    return scores;
};

module.exports = {
    calculatePlayerScore,
    getAllPlayerScores,
    updatePawnScoreAfterMove,
    handleCaptureScoring,
    getPlayerCaptureCount,
    determineWinner,
    formatScoresForClient
};