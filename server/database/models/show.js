const {Schema} = require('mongoose');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const showSchema = new Schema({
    user_id: {type: String, unique: false, required: true},
    show_id: {type: Number, unique: false, required: true},
    name: {type: String, required: true},
    overview: {type: String, required: true},
    following: {type: Boolean, default: true},
    img: {type: String, required: true},
    rating: {type: Number, required: true},

    seasons: [{
        id: {type: Number, required: true},
        name: {type: String, required: true},
        overview: {type: String, required: true},
        img: {type: String, required: true},
        seasonNum: {type: Number, required: true},

        episodes: [{
            id: {type: Number, required: true},
            name: {type: String, required: true},
            overview: {type: String, required: true},
            img: {type: String, required: true},
            episodeNum: {type: Number, required: true},
            date: {type: Date, required: true}
        }]
    }]
});

showSchema.index({user_id: 1, show_id: 1}, {unique: true});

const Show = mongoose.model('Show', showSchema);
module.exports = Show;