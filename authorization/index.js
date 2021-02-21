const { RoleActions } = require("../models/rbac");
const roleActions = require("../models/rbac/roleActions");
const roles = require("../models/rbac/roles");


const hasPermissions = async (user, module, permission) => {
	return await RoleActions.find({
		role: { $in: user.roles.map((role) => role.name) },
		module: module,
		action: permission,
	})
		.then((res) => {
			if (res) {
				console.log("User has permission.");
			} else {
				console.log("User does not have permission.");
			}
			return !!res;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
};

module.exports = {
	hasPermissions,
};
