import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../../App';
import refresh from '../../../images/login-page/refresh.png';
import NameInput from '../NameInput/NameInput';
import Overlay from '../../Overlay/Overlay';
import WindowLayout from '../WindowLayout/WindowLayout';
import ServersTable from './ServersTable/ServersTable';
import withLoading from '../../HOC/withLoading';
import useSocketData from '../../../hooks/useSocketData';
import Icon from '../../Icons/Icons';
import styles from './JoinServer.module.css';

const JoinServer = () => {
    const socket = useContext(SocketContext);
    const [rooms, setRooms] = useSocketData('room:rooms');

    const [joining, setJoining] = useState(false);
    const [clickedRoom, setClickedRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);

    useEffect(() => {
        socket.emit('room:rooms');
        socket.on('room:rooms', () => {
            setIsLoading(false);
        });
        
        socket.on('error:unauthorized', (message) => {
            alert(message);
        });
        
        return () => {
            socket.off('error:unauthorized');
        };
    }, [socket]);

    const getRooms = () => {
        setRooms([]);
        socket.emit('room:rooms');
    };

    const handleJoinClick = room => {
        setClickedRoom(room);
        setJoining(true);
    };

    const handleDeleteClick = room => {
        setRoomToDelete(room);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (roomToDelete) {
            socket.emit('room:delete', {
                roomId: roomToDelete._id
            });
            
            setShowDeleteModal(false);
            setRoomToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setRoomToDelete(null);
    };

    const ServersTableWithLoading = withLoading(ServersTable);

    return (
        <>
            <WindowLayout
                title='Join A Server'
                titleComponent={
                    <div className={styles.refresh}>
                        <img src={refresh} alt='refresh' onClick={getRooms} />
                    </div>
                }
                content={
                    <div className={styles.serversTableContainer}>
                        <ServersTableWithLoading
                            isLoading={isLoading}
                            rooms={rooms}
                            handleJoinClick={handleJoinClick}
                            handleDeleteClick={handleDeleteClick}
                        />
                    </div>
                }
            />
            {joining ? (
                <Overlay handleOverlayClose={() => setJoining(false)}>
                    <NameInput roomId={clickedRoom._id} isRoomPrivate={clickedRoom.private} />
                </Overlay>
            ) : null}
            
            {showDeleteModal && (
                <div className={styles.deleteModal}>
                    <div className={styles.deleteModalContent}>
                        <h3>
                            <Icon name="trash" size={20} className="inline-block mr-2" />
                            Delete Room
                        </h3>
                        <p>
                            Are you sure you want to delete the room 
                            <strong> "{roomToDelete?.name}"</strong>?
                        </p>
                        <p className={styles.warningText}>
                            <Icon name="warning" size={16} className="inline-block mr-2" />
                            This action cannot be undone. All players will be disconnected.
                        </p>
                        <div className={styles.deleteModalActions}>
                            <button 
                                onClick={cancelDelete} 
                                className={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete} 
                                className={styles.confirmDeleteBtn}
                            >
                                Delete Room
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default JoinServer;