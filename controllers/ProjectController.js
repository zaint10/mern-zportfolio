const models = require("../models");

const findProjectById = (projectId) => {
	return new Promise((resolve, reject) => {
		models.Projects.findById(projectId)
			.then((docProject) => {
				resolve(docProject);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

const createProjects = (project) => {
	return new Promise((resolve, reject) => {
		models.Projects.create(project)
			.then((docProject) => {
				// Assigning a project category (default)
				updateProjectCategory(docProject.map((project) => project._id))
					.then(() => {
						resolve(docProject);
					})
					.catch((err) => {
						reject(err);
					});
			})
			.catch((err) => {
				reject(err);
			});
	});
};

const updateProject = (project) => {
	return new Promise((resolve, reject) => {
		models.Projects.findByIdAndUpdate(
			project._id,
			{
				name: project.name || "",
				desc: project.desc || "",
				tech_used: project.tech_used || "",
				status: project.status || "",
				live_link: project.live_link || "",
			},
			(err, res) => {
				if (err) {
					reject(err);
				} else if (res) {
					resolve(res);
				}
			}
		);
	});
};

const updateProjects = (projects) => {
	return new Promise((resolve, reject) => {
		projects.forEach((project) => {
			updateProject(project).catch((err) => {
				reject(err);
			});
		});

		resolve();
	});
};

const deleteProject = (id) => {
	return new Promise((resolve, reject) => {
		models.Projects.findByIdAndDelete(id)
			.then((docProject) => {
				resolve(docProject);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

const updateProjectCategory = (projectids, category_name = "Others") => {
	return new Promise((resolve, reject) => {
		models.ProjectCatagories.findOne(
			{
				name: category_name,
			},
			(err, category) => {
				if (err) {
					reject(err);
				} else {
					if (category) {
						models.Projects.updateOne(
							{
								_id: { $in: projectids },
							},
							{
								category: category,
							}
						)
							.then((docProject) => {
								resolve();
							})
							.catch((err) => {
								reject(err);
							});
					}
				}
			}
		);
	});
};

const createCategory = async (def = "Others") => {
	return await new Promise((resolve, reject) => {
		models.ProjectCatagories.create({
			name: def,
		})
			.then((docCategory) => {
				resolve(docCategory);
			})
			.catch((err) => {
				reject(err);
			});
	});
};


module.exports = {
	findProjectById,
	createProjects,
	updateProjects,
	deleteProject,
	createCategory,
	updateProjectCategory,
};
