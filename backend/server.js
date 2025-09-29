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
        origin: [
            process.env.FRONTEND_URL || 'https://ludo-eight-beta.vercel.app',
            'https://ludo-eight-beta.vercel.app',
            'https://ludo-eight-beta.vercel.app/'
        ],
        credentials: true,
    })
);
app.use(sessionMiddleware);

app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Ludo Backend Server is running!',
        timestamp: new Date().toISOString()
    });
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
