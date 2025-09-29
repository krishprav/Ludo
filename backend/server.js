const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const { sessionMiddleware } = require('./config/session');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cookieParser());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());
app.set('trust proxy', 1);
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            
            const allowedOrigins = [
                'https://ludo-eight-beta.vercel.app',
                'https://ludo-eight-beta.vercel.app/',
                'http://localhost:3000',
                process.env.FRONTEND_URL
            ].filter(Boolean);
            
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
    })
);
app.use(sessionMiddleware);

app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Ludo Backend Server is running!',
        timestamp: new Date().toISOString(),
        cors: 'Configured for Vercel deployment'
    });
});

// Add explicit OPTIONS handler for CORS preflight
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || 'https://ludo-eight-beta.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

require('./config/database')(mongoose);
require('./config/socket')(server);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('./build'));
    app.get('*', (req, res) => {
        const indexPath = path.join(__dirname, './build/index.html');
        res.sendFile(indexPath);
    });
}

module.exports = { server };
