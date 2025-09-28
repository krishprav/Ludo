import React from 'react';

const Icon = ({ name, size = 16, className = '', ...props }) => {
    const iconStyles = {
        width: size,
        height: size,
        display: 'inline-block',
        ...props.style
    };

    const icons = {
        trophy: (
            <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyles} className={className}>
                <path d="M12 2C13.1 2 14 2.9 14 4V6H16C17.1 6 18 6.9 18 8V10C18 11.1 17.1 12 16 12H15V14C15 15.1 14.1 16 13 16H11C9.9 16 9 15.1 9 14V12H8C6.9 12 6 11.1 6 10V8C6 6.9 6.9 6 8 6H10V4C10 2.9 10.9 2 12 2ZM8 8V10H16V8H8ZM10 4V6H14V4H10ZM11 12H13V14H11V12Z"/>
                <path d="M5 18H19V20H5V18Z"/>
            </svg>
        ),
        crown: (
            <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyles} className={className}>
                <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM12 7.5L10.5 10H13.5L12 7.5ZM7 14H17V16H7V14Z"/>
            </svg>
        ),
        gamepad: (
            <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyles} className={className}>
                <path d="M17.5 12C17.5 12.83 16.83 13.5 16 13.5S14.5 12.83 14.5 12S15.17 10.5 16 10.5S17.5 11.17 17.5 12M7 10.5C6.17 10.5 5.5 11.17 5.5 12S6.17 13.5 7 13.5S8.5 12.83 8.5 12S7.83 10.5 7 10.5M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4S20 7.59 20 12S16.41 20 12 20M12 6C9.79 6 8 7.79 8 10S9.79 14 12 14S16 12.21 16 10S14.21 6 12 6M12 12C10.9 12 10 11.1 10 10S10.9 8 12 8S14 8.9 14 10S13.1 12 12 12Z"/>
            </svg>
        ),
        exit: (
            <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyles} className={className}>
                <path d="M14.08,15.59L16.67,13H7V11H16.67L14.08,8.41L15.5,7L20.5,12L15.5,17L14.08,15.59M19,3A2,2 0 0,1 21,5V9.67L19,7.67V5H5V19H19V16.33L21,14.33V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19Z"/>
            </svg>
        ),
        handshake: (
            <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyles} className={className}>
                <path d="M11 14H9C7.9 14 7 13.1 7 12V9C7 7.9 7.9 7 9 7H11C12.1 7 13 7.9 13 9V12C13 13.1 12.1 14 11 14M9 9V12H11V9H9M15 14H13C11.9 14 11 13.1 11 12V9C11 7.9 11.9 7 13 7H15C16.1 7 17 7.9 17 9V12C17 13.1 16.1 14 15 14M13 9V12H15V9H13M19 14H17C15.9 14 15 13.1 15 12V9C15 7.9 15.9 7 17 7H19C20.1 7 21 7.9 21 9V12C21 13.1 20.1 14 19 14M17 9V12H19V9H17M5 14H3C1.9 14 1 13.1 1 12V9C1 7.9 1.9 7 3 7H5C6.1 7 7 7.9 7 9V12C7 13.1 6.1 14 5 14M3 9V12H5V9H3Z"/>
            </svg>
        ),
        pause: (
            <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyles} className={className}>
                <path d="M14,19H18V5H14M6,19H10V5H6V19Z"/>
            </svg>
        ),
        play: (
            <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyles} className={className}>
                <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
            </svg>
        ),
        flag: (
            <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyles} className={className}>
                <path d="M14.4,6L14,4H5V21H7V14H12.6L13,16H20V6H14.4Z"/>
            </svg>
        ),
        settings: (
            <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyles} className={className}>
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
            </svg>
        ),
        close: (
            <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyles} className={className}>
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
        ),
        trash: (
            <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyles} className={className}>
                <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"/>
            </svg>
        ),
        warning: (
            <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyles} className={className}>
                <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
            </svg>
        ),
        home: (
            <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyles} className={className}>
                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
            </svg>
        ),
        chart: (
            <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyles} className={className}>
                <path d="M22,21H2V3H4V19H6V10H8V19H10V6H12V19H14V14H16V19H18V8H20V19H22Z"/>
            </svg>
        )
    };

    return icons[name] || null;
};

export default Icon;
