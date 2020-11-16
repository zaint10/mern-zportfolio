const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {RolesSchema} = require('./rbac');
const authorization = require('../authorization')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fname: {
        type: String,
        default: ''
    },
    lname: {
        type: String,
        default: ''
    },
    cname: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: mongoose.Schema.Types.String,
    },
    ph_number: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    about_summary: {
        type: String,
        default: ''
    },
    position_title: {
        type: String,
        default: ''
    },
    skills: {
        type: String,
        default: ''
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'projects'
    }],
    link_github: {
        type: String,
        default: ''
    },
    link_linkedin: {
        type: String,
        default: ''
    },
    roles: [RolesSchema]

});

userSchema.pre('save', function(next) {
    console.log(`Hashing password: ${this.password}`)
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
    next()
    
});


userSchema.methods.isValidPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

userSchema.methods.hasPermission = function(module, permission){
    
    authorization.hasPermissions(this, module, permission)
}

const model = mongoose.model('users', userSchema);


module.exports = model;

// {"_id":{"$oid":"5f9ebea457390d3be04699e5"},"fname":"zain","lname":"tanveer","cname":"xiQ, inc.","username":"WolvezineX0","ph_number":"+923204419651","email":"zat938@gmail.com","city":"lahore","country":"pakistan","about_summary":"","position_title":"fullstack python engineer","projects":[{"$oid":"5f9ec77b83fd1b092c77b308"}],"link_linkedin":"https://www.linkedin.com/in/zain-tanveer-571bb717a/","link_github":"https://github.com/zaint10","roles":[{"_id":{"$oid":"5fa5970e3c9f9b59f05d87df"},"name":"SUPER_USER","__v":0}]}