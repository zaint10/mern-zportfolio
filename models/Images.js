const mongoose = require('mongoose');
const Schema = mongoose.Schema

const imageSchema = new Schema({
    name: String,
    type: String,
    url:  String,
    key: String,
    createdAt: {type: Date, default: Date.now}
    
});

const model = mongoose.model('Images', imageSchema);


module.exports = {imageSchema, model};