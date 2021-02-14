const mongoose = require('mongoose');

const Games = new mongoose.Schema({
    game: {type: String, required: true}
})

module.exports = mongoose.model('Games', Games);