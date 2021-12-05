require('dotenv').config();
const {PORT} = process.env;
const cors = require('cors');
const express = require('express');
const app = express();


const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const dbConnection = require('./database');
const MongoStore = require('connect-mongo')(session);
const passport = require('./passport');
// Route requires
const user = require('./routes/user');

// MIDDLEWARE
app.use(morgan('dev'));
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// Sessions
app.use(
    session({
        secret: 'fraggle-rock', //pick a random string to make the hash that is generated secure
        store: new MongoStore({mongooseConnection: dbConnection}),
        resave: false, //required
        saveUninitialized: false //required
    })
);

// Passport
app.use(passport.initialize());
app.use(passport.session()); // calls the deserializeUser


// Routes
app.use('/user', user);


app.use(cors());
// app.use(express.json());
app.use(express.static('public'));

app.use('/search', require('./routes/search'));
app.use('/shows', require('./routes/shows'));
app.use('/myshows', require('./routes/myshows'));

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});