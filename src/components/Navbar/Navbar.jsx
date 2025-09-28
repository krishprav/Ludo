import React from 'react';
import Dice from './Dice/Dice';
import NameContainer from './NameContainer/NameContainer';
import ReadyButton from './ReadyButton/ReadyButton';
import { PLAYER_COLORS } from '../../constants/colors';
import { useContext } from 'react';
import { PlayerDataContext } from '../../App';
import styles from './Navbar.module.css';

const Navbar = ({ players, started, time, isReady, rolledNumber, nowMoving, movingPlayer, ended, gameTimeRemaining }) => {
    const context = useContext(PlayerDataContext);

    const diceProps = {
        rolledNumber,
        nowMoving,
        movingPlayer,
    };

    return (
        <>
            {players.map((player, index) => {
                const isCurrentPlayer = started && !ended && player.nowMoving;
                const playerColor = PLAYER_COLORS[index];
                
                return (
                    <div 
                        className={`
                            ${styles.playerContainer} 
                            ${styles[playerColor]}
                            ${isCurrentPlayer ? styles.currentPlayer : ''}
                            ${isCurrentPlayer ? styles[playerColor] : ''}
                        `} 
                        key={index}
                    >
                        <NameContainer player={player} time={time} />
                        {started && !ended ? <Dice playerColor={playerColor} {...diceProps} /> : null}
                        {context.color === player.color && !started ? <ReadyButton isReady={isReady} /> : null}
                    </div>
                );
            })}
        </>
    );
};

export default Navbar;
