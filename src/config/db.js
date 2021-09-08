/**
 *
 * Copyright HackerBay, Inc.
 *
 */

const mongoose = require('mongoose');
const mongoUrl =
    process.env['MONGO_URL'] || 'mongodb://localhost:27017/boum-test';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose
    .connect(mongoUrl, options)
    .then(() => {
        // eslint-disable-next-line
        return console.log('Mongo connected');
    })
    .catch(err => {
        // mongoose connection error will be handled here
        // eslint-disable-next-line
        console.error('App starting error:', err.stack);
        process.exit(1);
    });

module.exports = mongoose;
