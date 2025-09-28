const { getRooms, getRoom, updateRoom, createNewRoom, deleteRoom } = require('../services/roomService');
const { sendToOnePlayerRooms, sendToOnePlayerData, sendWinner, sendScoreUpdate } = require('../socket/emits');

module.exports = socket => {
    const req = socket.request;

    const handleGetData = async () => {
        const room = await getRoom(req.session.roomId);
        if (room.nextMoveTime <= Date.now()) {
            room.changeMovingPlayer();
            await updateRoom(room);
        }
        sendToOnePlayerData(socket.id, room);
        if (room.winner) sendWinner(socket.id, room.winner);
        
        if (room.started) {
            const formattedScores = room.getFormattedScores();
            socket.emit('game:scores', formattedScores);
            
            const remainingTime = room.getRemainingGameTime();
            socket.emit('game:timeRemaining', remainingTime);
        }
    };

    const handleGetAllRooms = async () => {
        const rooms = await getRooms();
        sendToOnePlayerRooms(socket.id, rooms);
    };

    const handleCreateRoom = async data => {
        await createNewRoom(data);
        sendToOnePlayerRooms(socket.id, await getRooms());
    };

    const handleDeleteRoom = async data => {
        const { roomId } = data;
        const room = await getRoom(roomId);
        
        if (room && room.players.length === 0) {
            await deleteRoom(roomId);
            const updatedRooms = await getRooms();
            socket.broadcast.emit('room:rooms', JSON.stringify(updatedRooms));
            sendToOnePlayerRooms(socket.id, updatedRooms);
        } else {
            socket.emit('error:unauthorized', 'Cannot delete room with active players');
        }
    };

    socket.on('room:data', handleGetData);
    socket.on('room:rooms', handleGetAllRooms);
    socket.on('room:create', handleCreateRoom);
    socket.on('room:delete', handleDeleteRoom);
};
