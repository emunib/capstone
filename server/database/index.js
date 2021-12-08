const mongoose = require('mongoose');
const {DB_URI} = process.env;


mongoose.connect(DB_URI).then(
    () => {
        console.log('Connected to MongoDB');
    },
    err => {
        console.log('error connecting to Mongo: ');
        console.log(err);
    }
);

module.exports = mongoose.connection;