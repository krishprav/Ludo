import lock from '../../../../images/login-page/lock.png';
import Icon from '../../../Icons/Icons';
import styles from './ServersTable.module.css';

const ServerListTable = ({ rooms, handleJoinClick, handleDeleteClick }) => {
    return (
        <table className={styles.rooms}>
            <thead>
                <tr>
                    <th className={styles.firstColumn}></th>
                    <th>Server</th>
                    <th>#/#</th>
                    <th>Status</th>
                    <th className={styles.lastColumn}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {rooms.map((room, index) => {
                    return room.started ? null : (
                        <tr key={index}>
                            <td>{room.private ? <img src={lock} alt='private' /> : null}</td>
                            <td className={styles.roomName}>{room.name}</td>
                            <td>{`${room.players.length}/4`}</td>
                            <td>{room.isStarted ? 'started' : 'waiting'}</td>
                            <td className={styles.lastColumn}>
                                <div className={styles.actionButtons}>
                                    <button 
                                        className={styles.joinBtn}
                                        onClick={() => handleJoinClick(room)}
                                    >
                                        Join
                                    </button>
                                    <button 
                                        className={styles.deleteBtn}
                                        onClick={() => handleDeleteClick(room)}
                                        title="Delete room (only creator can delete)"
                                    >
                                        <Icon name="trash" size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default ServerListTable;