//Connect to Mongo database
const mongoose = require('mongoose');
// mongoose.Promise = global.Promise

//your local database url
//27017 is the default mongoDB port
const uri = 'mongodb+srv://admin:gze_GUM8nfu6mht0dta@cluster0.lbkb2.mongodb.net/mern-db';

mongoose.connect(uri).then(
    () => {
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
        console.log('Connected to Mongo');
    },
    err => {
        /** handle initial connection error */
        console.log('error connecting to Mongo: ');
        console.log(err);
    }
);

module.exports = mongoose.connection;