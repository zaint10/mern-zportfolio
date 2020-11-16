const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleActionsSchema = new Schema({
	role: {
		type: String,
		ref: "roles.name",
    },
    module: {
        type: String,
        ref: 'modules._id'
    },
    action: {
        type: String,
        ref: 'actions._id'
    },

    
});

roleActionsSchema.index({role:1, module:1, action: 1}, { unique: true });

module.exports = mongoose.model("roleActions", roleActionsSchema);
