const { getRoom, updateRoom } = require('../services/roomService');
const { sendToPlayersRolledNumber, sendWinner, sendScoreUpdate } = require('../socket/emits');
const { rollDice, isMoveValid } = require('./handlersFunctions');
const socketManager = require('../socket/socketManager');

module.exports = socket => {
    const req = socket.request;

    const handleMovePawn = async pawnId => {
        const room = await getRoom(req.session.roomId);
        if (room.winner || room.paused) return;
        const pawn = room.getPawn(pawnId);
        if (isMoveValid(req.session, pawn, room)) {
            room.movePawn(pawn);
            room.changeMovingPlayer();
            
            const formattedScores = room.getFormattedScores();
            sendScoreUpdate(room._id.toString(), formattedScores);
            
            const winner = room.getWinner();
            if (winner) {
                room.endGame(winner);
                sendWinner(room._id.toString(), winner);
            }
            await updateRoom(room);
        }
    };

    const handleRollDice = async () => {
        const room = await getRoom(req.session.roomId);
        if (room.paused || room.winner) return;
        
        const rolledNumber = rollDice();
        sendToPlayersRolledNumber(req.session.roomId, rolledNumber);
        await updateRoom({ _id: req.session.roomId, rolledNumber: rolledNumber });
        const player = room.getPlayer(req.session.playerId);
        if (!player.canMove(room, rolledNumber)) {
            room.changeMovingPlayer();
            await updateRoom(room);
        }
    };

    const handleQuitGame = async (data) => {
        const room = await getRoom(data.roomId);
        if (room.winner) return;
        
        room.endGame('quit');
        sendWinner(room._id.toString(), 'quit');
        await updateRoom(room);
    };

    const handleOfferDraw = async (data) => {
        const room = await getRoom(data.roomId);
        if (room.winner || room.paused) return;
        
        socketManager.getIO().to(data.roomId).emit('game:drawOffered', {
            offeringPlayer: data.playerName,
            playerId: data.playerId
        });
    };

    const handleAcceptDraw = async (data) => {
        const room = await getRoom(data.roomId);
        if (room.winner || room.paused) return;
        
        room.endGame('draw');
        sendWinner(room._id.toString(), 'draw');
        await updateRoom(room);
    };

    const handleDeclineDraw = async (data) => {
        const room = await getRoom(data.roomId);
        if (room.winner || room.paused) return;
        
        socketManager.getIO().to(data.roomId).emit('game:drawResponse', {
            accepted: false
        });
    };

    const handlePauseGame = async (data) => {
        const room = await getRoom(data.roomId);
        if (room.winner) return;
        
        room.paused = data.paused;
        await updateRoom(room);
        
        socketManager.getIO().to(data.roomId).emit('game:paused', {
            paused: data.paused
        });
    };

    const handleSurrender = async (data) => {
        const room = await getRoom(data.roomId);
        if (room.winner || room.paused) return;
        
        const surrenderingPlayer = room.getPlayer(data.playerId);
        const remainingPlayers = room.players.filter(p => p._id.toString() !== data.playerId);
        
        if (remainingPlayers.length === 1) {
            room.endGame(remainingPlayers[0].color);
            sendWinner(room._id.toString(), remainingPlayers[0].color);
        } else {
            const winner = room.getWinnerByScore();
            room.endGame(winner);
            sendWinner(room._id.toString(), winner);
        }
        
        await updateRoom(room);
    };

    socket.on('game:roll', handleRollDice);
    socket.on('game:move', handleMovePawn);
    socket.on('game:quit', handleQuitGame);
    socket.on('game:offerDraw', handleOfferDraw);
    socket.on('game:acceptDraw', handleAcceptDraw);
    socket.on('game:declineDraw', handleDeclineDraw);
    socket.on('game:pause', handlePauseGame);
    socket.on('game:surrender', handleSurrender);
};