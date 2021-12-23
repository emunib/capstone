const {Schema} = require('mongoose');
const mongoose = require('mongoose');

const showSchema = new Schema({
    userId: {type: String, unique: false, required: true},
    showId: {type: Number, unique: false, required: true},
    data: {
        _id: false,
        type: {
            _id: false,
            id: {type: Number, required: true},
            name: {type: String, required: stringRequired('name')},
            overview: {type: String, required: stringRequired('overview')},
            following: {type: Boolean, default: true},
            img: {type: String, required: true},
            rating: {type: Number, required: true},

            seasons: {
                type: [{
                    _id: false,
                    id: {type: Number, required: true},
                    name: {type: String, required: stringRequired('name')},
                    overview: {type: String, required: stringRequired('overview')},
                    img: {type: String, required: true},
                    seasonNum: {type: Number, required: true},

                    episodes: {
                        type: [{
                            _id: false,
                            id: {type: Number, required: true},
                            name: {type: String, required: stringRequired('name')},
                            overview: {type: String, required: stringRequired('overview')},
                            img: {type: String, required: true},
                            episodeNum: {type: Number, required: true},
                            date: {type: Date, required: true}
                        }],
                        required: true
                    }
                }],
                required: true
            }
        },
        required: true
    }
});

function stringRequired(field) {
    return function () {
        return typeof this[field] !== 'string';
    };
}

showSchema.pre('save', function (next) {
    this.data.following = true;
    next();
});

showSchema.index({userId: 1, showId: 1}, {unique: true});

const Show = mongoose.model('Show', showSchema);
module.exports = Show;