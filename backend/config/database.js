module.exports = function (mongoose) {
    mongoose.set('useFindAndModify', false);
    
    const connectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'test',
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
    };
    
    mongoose
        .connect(process.env.CONNECTION_URI, connectionOptions)
        .then(() => {
            console.log('MongoDB Connected Successfully!');
        })
        .catch(err => {
            console.error('Error connecting to MongoDB:', err.message);
            process.exit(1);
        });
};