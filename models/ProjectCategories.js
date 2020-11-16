const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const projectCategorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        sparse: true
    },
    

});




const model = mongoose.model('project_catagories', projectCategorySchema);

module.exports = {projectCategorySchema, model};
