const mongoose = require('mongoose');
const Schema = mongoose.Schema


const modulesSchema = new Schema({
    _id: {
        type: String,
        unique: true
    },
})

module.exports = mongoose.model('modules', modulesSchema);