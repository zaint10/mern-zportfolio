const mongoose = require('mongoose');
const Schema = mongoose.Schema


const rolesSchema = new Schema({
    name: {
        type: String,
        unique: true,
        sparse: true 
    }
})
const roles = mongoose.model('roles', rolesSchema);
module.exports = {rolesSchema, roles}