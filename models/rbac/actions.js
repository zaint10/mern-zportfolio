const mongoose = require('mongoose');
const Schema = mongoose.Schema


const actionsSchema = new Schema({
    _id: {
        type: String,
        unique: true
    },
})

module.exports = mongoose.model('actions', actionsSchema);