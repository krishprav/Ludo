const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
    uri: process.env.CONNECTION_URI,
    collection: 'sessions',
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    bufferMaxEntries: 0,
    bufferCommands: false,
    maxPoolSize: 10,
    minPoolSize: 5,
    maxIdleTimeMS: 30000,
    retryWrites: true,
    w: 'majority',
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    tlsInsecure: false,
});
const sessionMiddleware = session({
    store: store,
    credentials: true,
    cookie: {
        httpOnly: false,
        secure: false,
    },
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    maxAge: 20000,
});

const wrap = expressMiddleware => (socket, next) => expressMiddleware(socket.request, {}, next);

module.exports = { sessionMiddleware, wrap };