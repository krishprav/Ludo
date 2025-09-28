const socketManager = require('./socketManager');

const sendToPlayersRolledNumber = (id, rolledNumber) => {
    socketManager.getIO().to(id).emit('game:roll', rolledNumber);
};

const sendToPlayersData = room => {
    socketManager.getIO().to(room._id.toString()).emit('room:data', JSON.stringify(room));
};

const sendToOnePlayerData = (id, room) => {
    socketManager.getIO().to(id).emit('room:data', JSON.stringify(room));
};

const sendToOnePlayerRooms = (id, rooms) => {
    socketManager.getIO().to(id).emit('room:rooms', JSON.stringify(rooms));
};

const sendWinner = (id, winner) => {
    socketManager.getIO().to(id).emit('game:winner', winner);
};

const sendScoreUpdate = (roomId, scores) => {
    socketManager.getIO().to(roomId).emit('game:scores', scores);
};

module.exports = {
    sendToPlayersData,
    sendToPlayersRolledNumber,
    sendToOnePlayerData,
    sendToOnePlayerRooms,
    sendWinner,
    sendScoreUpdate,
};