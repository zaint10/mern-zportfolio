const { RbacModels } = require("../../models");
const { Users } = require("../../models");

// Create

const createActions = (actions) => {
	return new Promise((resolve, reject) => {
		console.log("Creating action(s) now...", actions);
		RbacModels.Actions.insertMany(actions)
			.then((result) => {
				console.log("Action(s) are created.");
				resolve(result);
			})
			.catch((err) => {
				console.log("Error occured while creating action(s).");
				reject(err);
			});
	});
};

const createModules = (modules) => {
	return new Promise((resolve, reject) => {
		console.log("Creating module(s) now...", modules);
		RbacModels.Modules.insertMany(modules)
			.then((result) => {
				console.log("Module(s) are created");
				resolve(result);
			})
			.catch((err) => {
				console.log("Error occured while creationg module(s)");
				reject(err);
			});
	});
};

const createRoles = (roles) => {
	return new Promise((resolve, reject) => {
		console.log("Creating role(s) now...", roles);

		RbacModels.Roles.insertMany(roles)
			.then((result) => {
				console.log("Role(s) are created.");
				resolve(result);
			})
			.catch((err) => {
				console.log("Error occured while creating role(s).");
				reject(err);
			});
	});
};

const createRoleActions = (role, modulesActions) => {
	return new Promise((resolve, reject) => {
		console.log("Assigning actions on modules to a role");
		const rows = [];
		for (const [module, actions] of Object.entries(modulesActions)) {
			actions.forEach((action) => {
				rows.push({ role: role, module: module, action: action });
			});
		}

		RbacModels.RoleActions.insertMany(rows)
			.then((result) => {
				console.log(
					"Module and its respective Action(s) have been assigned to the role"
				);
				resolve(result);
			})
			.catch((err) => {
				console.log(
					"Error occured while assigning module and its actions to the Role."
				);
				reject(err);
			});
	});
};

const createModuleActions = (moduleActions) => {
	return new Promise((resolve, reject) => {
		RbacModels.ModuleActions.insertMany(moduleActions)
			.then((result) => {
				console.log("Module actions are created");
				resolve(result);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

const createUserRoles = (userid, roles) => {
	return new Promise((resolve, reject) => {
		Users.findById(userid, (err, docUser) => {
			if (err) {
				reject(err);
			}
			
			if (docUser) {
				RbacModels.Roles.find({ name: { $in: roles } }, (err, docRoles) => {
					if(err){
						reject(err)
					}
					docUser.updateMany(
						{ $push: { roles: {$each: docRoles} } },
						{ new: true, useFindAndModify: false },
					).then(result => {
						console.log('User has been assigned role(s).')
					
					}).catch(err => {
						reject(err)
					})
				})
				
			}
		});
	});
};

// Read

const getUserRoles = (userid) => {};
module.exports = {
	createActions,
	createModules,
	createRoles,
	createRoleActions,
	createModuleActions,
	createUserRoles,
};
