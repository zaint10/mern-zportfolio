const mongoose = require("mongoose");
const {projectCategorySchema}  = require("./ProjectCategories");
const {imageSchema}  = require("./Images");

const Schema = mongoose.Schema;

const projectSchema = new Schema({
	name: String,
	desc: String,
	tech_used: String,
	status: String,
	live_link: String,
	category: {
        type: projectCategorySchema,
        default: null
	},
	image: {
		type: imageSchema,
        default: null
	}
});



const model = mongoose.model("projects", projectSchema);

module.exports = model;
