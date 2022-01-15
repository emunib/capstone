require('dotenv').config();
const {PORT, SESSION_SECRET, NODE_ENV} = process.env;
const cors = require('cors');
const express = require('express');
const app = express();
const session = require('express-session');
const dbConnection = require('./database');
const MongoStore = require('connect-mongo')(session);
const passport = require('./passport');

app.set('trust proxy', 1);
app.use(
    session({
        secret: SESSION_SECRET,
        store: new MongoStore({mongooseConnection: dbConnection}),
        resave: false,
        saveUninitialized: false,
        ttl: 60 * 60 * 24 * 30,
        cookie: {
            sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
            secure: NODE_ENV === 'production',
            maxAge: 60000000
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    credentials: true,
    origin: [process.env.FRONTEND_URI]
}));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));

app.use('/user', require('./routes/user'));
app.use(function (req, res, next) {
    if (req.user) {
        next();
    } else {
        res.status(401).json({error: 'Unauthorized'});
    }
});
app.use('/shows', require('./routes/shows'));
app.use('/myshows', require('./routes/myshows'));

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});