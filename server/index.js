require('dotenv').config();
const {PORT, SESSION_SECRET} = process.env;
const cors = require('cors');
const express = require('express');
const app = express();
const session = require('express-session');
const dbConnection = require('./database');
const MongoStore = require('connect-mongo')(session);
const passport = require('./passport');

app.use(
    session({
        secret: SESSION_SECRET,
        store: new MongoStore({mongooseConnection: dbConnection}),
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(express.static('public'));

app.use('/search', require('./routes/search'));
app.use('/shows', require('./routes/shows'));
app.use('/myshows', require('./routes/myshows'));
app.use('/user', require('./routes/user'));

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});