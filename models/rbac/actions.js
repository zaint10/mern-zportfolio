const mongoose = require('mongoose');
const Schema = mongoose.Schema


const actionsSchema = new Schema({
    _id: String
})

module.exports = mongoose.model('actions', actionsSchema);