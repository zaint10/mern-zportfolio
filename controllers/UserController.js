const { Users } = require("../models");
const models = require("../models");

class UserController {
	constructor() {}

	getByUsername(username) {
		console.log('Getting user by username: ' + username )
		return new Promise((resolve, reject) =>{
			Users.findOne({
				username: username
			}).then(docUser => {
				resolve(docUser)
			}).catch(err => {
				reject(err)
			})
		})
		
	}

	createUserWUsernameAndPassword(username, password) {
		return new Promise((resolve, reject) => {
			models.Users.create({
				username: username,
				password: password,
				
			}).then(result => {
				console.log('User is created');
				resolve(result)
			}).catch(err => {
				console.log('Error occured while creating user.')
				reject(err)
			})
		})
		
	}

	updateUser(userId, user) {
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
		},
		(err, res) => {
			console.log('User Info Updated');
		});
	}

	addProject(userId, project) {
		models.Users.findByIdAndUpdate(
			userId,
			{ $push: { projects: project._id } },
			{ new: true, useFindAndModify: false },
			(err, res) => {
				if(err){
					console.log(err);
				}else{
					console.log('Project has been added for the user')
				}
				
				
			}
		);
	}

	addProjects(userId, projects) {
		projects.forEach((docProject) => {
			this.addProject(userId, docProject);
		});
	}

	
	deleteProject(userId, pid) {
		models.Users.findByIdAndUpdate(
			userId,
			{ $pull: { projects: pid } },
			(err, res) => {
				console.log(`Project Ref: ${pid} deleted from User`);
			}
		);
	}

	getPopulateProjects(userId) {
		return models.Users.findById(userId).populate("projects").lean();
	}
}


module.exports = new UserController();
