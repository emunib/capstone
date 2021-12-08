const express = require('express');
const router = express.Router();
const User = require('../database/models/user');
const passport = require('../passport');

router.post('/', (req, res) => {
    const {username, password} = req.body;

    User.findOne({username: username}, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err);
        } else if (user) {
            res.json({
                error: `Sorry, already a user with the username: ${username}`
            });
        } else {
            const newUser = new User({
                username: username,
                password: password
            });
            newUser.save((err, savedUser) => {
                if (err) return res.status(400).json(err);
                res.json(savedUser);
            });
        }
    });
});

router.post('/login', (req, res, next) => {
        next();
    }, passport.authenticate('local'), (req, res) => {
        res.send({
            username: req.user.username
        });
    }
);

router.get('/', (req, res, next) => {
    if (req.user) {
        res.json({user: req.user});
    } else {
        res.json({user: null});
    }
});

router.post('/logout', (req, res) => {
    if (req.user) {
        req.logout();
        res.json({message: 'logging out'});
    } else {
        res.json({message: 'no user to log out'});
    }
});

module.exports = router;