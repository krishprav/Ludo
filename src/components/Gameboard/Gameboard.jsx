import React, { useState, useEffect, useContext } from 'react';
import ReactLoading from 'react-loading';
import { PlayerDataContext, SocketContext } from '../../App';
import useSocketData from '../../hooks/useSocketData';
import Map from './Map/Map';
import Navbar from '../Navbar/Navbar';
import Scoreboard from '../Scoreboard/Scoreboard';
import WinnerOverlay from '../WinnerOverlay/WinnerOverlay';
import GameControls from '../GameControls/GameControls';
import GameSettings from '../GameSettings/GameSettings';
import GameTimer from '../GameTimer/GameTimer';

const Gameboard = () => {
    const socket = useContext(SocketContext);
    const context = useContext(PlayerDataContext);
    const [pawns, setPawns] = useState([]);
    const [players, setPlayers] = useState([]);

    const [rolledNumber, setRolledNumber] = useSocketData('game:roll');
    const [time, setTime] = useState();
    const [isReady, setIsReady] = useState();
    const [nowMoving, setNowMoving] = useState(false);
    const [started, setStarted] = useState(false);

    const [movingPlayer, setMovingPlayer] = useState('red');
    const [winner, setWinner] = useState(null);
    const [gameEnded, setGameEnded] = useState(false);
    const [finalScores, setFinalScores] = useState({});
    const [gameTimeRemaining, setGameTimeRemaining] = useState(0);

    useEffect(() => {
        socket.emit('room:data', context.roomId);
        socket.on('room:data', data => {
            data = JSON.parse(data);
            if (data.players == null) return;
            while (data.players.length !== 4) {
                data.players.push({ name: '...' });
            }
            const nowMovingPlayer = data.players.find(player => player.nowMoving === true);
            if (nowMovingPlayer) {
                if (nowMovingPlayer._id === context.playerId) {
                    setNowMoving(true);
                } else {
                    setNowMoving(false);
                }
                setMovingPlayer(nowMovingPlayer.color);
            }
            const currentPlayer = data.players.find(player => player._id === context.playerId);
            setIsReady(currentPlayer.ready);
            setRolledNumber(data.rolledNumber);
            setPlayers(data.players);
            setPawns(data.pawns);
            setTime(data.nextMoveTime);
            setStarted(data.started);
        });

        socket.on('game:winner', winner => {
            setWinner(winner);
            setGameEnded(true);
        });

        socket.on('game:draw', () => {
            setWinner('draw');
            setGameEnded(true);
        });

        socket.on('game:quit', () => {
            setGameEnded(true);
        });

        socket.on('game:scores', (scores) => {
            setFinalScores(scores);
        });

        socket.on('game:timeRemaining', (timeRemaining) => {
            setGameTimeRemaining(timeRemaining);
        });

        socket.on('redirect', () => {
            window.location.reload();
        });

    }, [socket, context.playerId, context.roomId, setRolledNumber]);

    return (
        <>
            {pawns.length === 16 ? (
                <div className={`container ${started && !gameEnded ? 'hasActivePlayer' : ''}`}>
                    <GameTimer timeRemaining={gameTimeRemaining} />
                    <Navbar
                        players={players}
                        started={started}
                        time={time}
                        isReady={isReady}
                        movingPlayer={movingPlayer}
                        rolledNumber={rolledNumber}
                        nowMoving={nowMoving}
                        ended={winner !== null}
                    />
                    <Map pawns={pawns} nowMoving={nowMoving} rolledNumber={rolledNumber} />
                    {started && <Scoreboard />}
                    <GameControls 
                        gameStarted={started}
                        isCurrentPlayer={nowMoving}
                        players={players}
                        gameEnded={gameEnded}
                    />
                    <GameSettings 
                        gameStarted={started}
                        isHost={context.playerId === players[0]?._id}
                    />
                </div>
            ) : (
                <ReactLoading type='spinningBubbles' color='white' height={667} width={375} />
            )}
            {winner ? (
                <WinnerOverlay 
                    winner={winner}
                    finalScores={finalScores}
                    onPlayAgain={() => socket.emit('player:exit')}
                />
            ) : null}
        </>
    );
};

export default Gameboard;
