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

const findProjectByIds = (projects) => {
	return new Promise((resolve, reject) => {
		models.Projects.find({
			_id: { $in: projects.map((project) => project._id) },
		})
			.then((docProjects) => {
				resolve(docProjects);
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
			async (err, category) => {
				if (err) {
					reject(err);
				} else {
					let isDefault = false;
					if (!category) {
						category = await models.ProjectCatagories.create({ name: category_name });
						isDefault = true;
					}
					if (category || isDefault) {
						models.Projects.updateOne(
							{
								_id: { $in: projectids },
							},
							{
								category: category,
							}
						)
							.then(() => {
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
	findProjectByIds,
	createProjects,
	updateProjects,
	deleteProject,
	createCategory,
	updateProjectCategory,
};
