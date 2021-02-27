const mongoose = require('mongoose');
const Schema = mongoose.Schema


const modulesSchema = new Schema({
    _id: String
})

module.exports = mongoose.model('modules', modulesSchema);