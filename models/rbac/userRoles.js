const mongoose = require('mongoose');
const Schema = mongoose.Schema


const userRolesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roles'
    }
})

module.exports = mongoose.model('userRoles', userRolesSchema);