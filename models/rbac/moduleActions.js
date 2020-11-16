const mongoose = require('mongoose');
const Schema = mongoose.Schema


const moduleActionsSchema = new Schema({
    module: {
        type: String, 
        ref: 'modules._id'
    },
    action: {
        type: String, 
        ref: 'actions._id'
    },
    description: {
        type: String
    }
});


moduleActionsSchema.index({ module: 1, action: 1 }, { unique: true });
const moduleActions = mongoose.model('moduleActions', moduleActionsSchema)
module.exports = {moduleActions}
