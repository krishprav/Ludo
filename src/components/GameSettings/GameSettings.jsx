import React, { useState, useContext } from 'react';
import { SocketContext, PlayerDataContext } from '../../App';
import Icon from '../Icons/Icons';
import styles from './GameSettings.module.css';

const GameSettings = ({ gameStarted, isHost }) => {
    const socket = useContext(SocketContext);
    const context = useContext(PlayerDataContext);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        moveTime: 15,
        enableSound: true,
        showHints: true,
        autoRoll: false
    });

    const handleSettingChange = (setting, value) => {
        const newSettings = { ...settings, [setting]: value };
        setSettings(newSettings);
        
        if (gameStarted && isHost) {
            socket.emit('game:updateSettings', {
                roomId: context.roomId,
                settings: newSettings
            });
        }
    };

    const handleToggleSettings = () => {
        setShowSettings(!showSettings);
    };

    if (!gameStarted) {
        return null;
    }

    return (
        <div className={styles.settingsContainer}>
            <button 
                className={styles.settingsToggle}
                onClick={handleToggleSettings}
                title="Game Settings"
            >
                <Icon name="settings" size={22} />
            </button>

            {showSettings && (
                <div className={styles.settingsPanel}>
                    <div className={styles.settingsHeader}>
                        <h3>Game Settings</h3>
                        <button 
                            className={styles.closeBtn}
                            onClick={handleToggleSettings}
                        >
                            <Icon name="close" size={18} />
                        </button>
                    </div>

                    <div className={styles.settingsContent}>
                        <div className={styles.settingItem}>
                            <label className={styles.settingLabel}>
                                Move Timer (seconds)
                            </label>
                            <select 
                                className={styles.settingSelect}
                                value={settings.moveTime}
                                onChange={(e) => handleSettingChange('moveTime', parseInt(e.target.value))}
                                disabled={!isHost}
                            >
                                <option value={10}>10 seconds</option>
                                <option value={15}>15 seconds</option>
                                <option value={20}>20 seconds</option>
                                <option value={30}>30 seconds</option>
                            </select>
                        </div>

                        <div className={styles.settingItem}>
                            <label className={styles.settingLabel}>
                                <input 
                                    type="checkbox"
                                    className={styles.settingCheckbox}
                                    checked={settings.enableSound}
                                    onChange={(e) => handleSettingChange('enableSound', e.target.checked)}
                                />
                                Enable Sound Effects
                            </label>
                        </div>

                        <div className={styles.settingItem}>
                            <label className={styles.settingLabel}>
                                <input 
                                    type="checkbox"
                                    className={styles.settingCheckbox}
                                    checked={settings.showHints}
                                    onChange={(e) => handleSettingChange('showHints', e.target.checked)}
                                />
                                Show Move Hints
                            </label>
                        </div>

                        <div className={styles.settingItem}>
                            <label className={styles.settingLabel}>
                                <input 
                                    type="checkbox"
                                    className={styles.settingCheckbox}
                                    checked={settings.autoRoll}
                                    onChange={(e) => handleSettingChange('autoRoll', e.target.checked)}
                                />
                                Auto Roll Dice
                            </label>
                        </div>

                        {!isHost && (
                            <div className={styles.hostOnly}>
                                <small>Only the host can change game settings</small>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameSettings;
