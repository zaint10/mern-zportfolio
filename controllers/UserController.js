const { Users } = require("../models");
const models = require("../models");

class UserController {
	constructor() {}

	getByUsername(username) {
		
		return new Promise((resolve, reject) => {
			Users.findOne({
				username: username,
			})
				.then((docUser) => {
					resolve(docUser);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	createUserWUsernameAndPassword(username, password) {
		return new Promise((resolve, reject) => {
			models.Users.create({
				username: username,
				password: password,
			})
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	updateUser(userId, user) {
		return new Promise((resolve, reject) => {
			models.Users.findByIdAndUpdate(userId, {
				fname: user.fname,
				lname: user.lname,
				cname: user.cname,
				ph_number: user.ph_number,
				email: user.email,
				city: user.city,
				country: user.country,
				about_summary: user.about_summary,
				position_title: user.position_title,
				skills: user.skills,
				link_github: user.link_github,
				link_linkedin: user.link_linkedin,
			})
				.then((docUser) => {
					resolve(docUser);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	addProject(userId, project) {
		return new Promise((resolve, reject) => {
			models.Users.findByIdAndUpdate(
				userId,
				{ $push: { projects: project._id } },
				{ new: true, useFindAndModify: false },
				(err, res) => {
					if (err) {
						reject(err);
					} else {
						resolve(
							`Project: ${project._id} has been added for the user: ${userId}`
						);
					}
				}
			);
		});
	}

	addProjects(userId, projects) {
		return new Promise((resolve, reject) => {
			projects.forEach((docProject) => {
				this.addProject(userId, docProject).catch((err) => {
					reject(err);
				});
			});
			resolve();
		});
	}

	deleteProject(userId, pid) {
		return new Promise((resolve, reject) => {
			models.Users.findByIdAndUpdate(
				userId,
				{ $pull: { projects: pid } },
				(err, res) => {
					if (err) {
						reject(err);
					} else {
						resolve(res);
					}
				}
			);
		});
	}

	getPopulateProjects(userId) {
		return models.Users.findById(userId).populate("projects").lean();
	}
}

module.exports = new UserController();
