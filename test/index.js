process.env.PORT = 3020;
process.env.MONGO_URL = 'mongodb://localhost:27017/boum-test-db';
try {
    require('./socket.test');
    require('./user.test');
    require('./channel.test');
} catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw error;
}
