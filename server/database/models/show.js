const {Schema} = require('mongoose');
const mongoose = require('mongoose');

const showSchema = new Schema({
    user_id: {type: String, unique: false, required: true},
    show_id: {type: Number, unique: false, required: true}
});

showSchema.index({user_id: 1, show_id: 1}, {unique: true});

const Show = mongoose.model('Show', showSchema);
module.exports = Show;