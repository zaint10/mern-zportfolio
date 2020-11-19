const models = require("../models");

const findProjectById = (projectId) => {
	return new Promise((resolve, reject) => {
		models.Projects.findById(
			projectId
		).then(docProject => {
			resolve(docProject)
		}).catch(err => {
			reject(err)
		})
	})
	
}

const createProject = (project) => {
	return models.Projects.create(project)
		.then((docProject) => {
			console.log(`Projects are created.`);
			updateProjectCategory(docProject.map((project) => project._id))
			
			return docProject;
		})
		.catch((err) => {
			console.log(err);
		});
};

const updateProject = (project) => {
	models.Projects.findByIdAndUpdate(
		project._id,
		{
			name: project.name || '',
			desc: project.desc || '',
			tech_used: project.tech_used || '',
			status: project.status || '',
			live_link: project.live_link || '',
		},
		(err, res) => {
			console.log(`Project updated. ${project._id}`);
		}
	);
};

const updateProjects = (projects) => {
    projects.forEach(project => {
        updateProject(project)
    });
};

const deleteProject = (id) => {
	models.Projects.findByIdAndDelete(id)
		.then((docProject) => {
			console.log(`Project is deleted: id: ${docProject._id}`);
		})
		.catch((err) => {
			console.log(err);
		});
};

const updateProjectCategory = (projectids, category_name='Others') => {
	return models.ProjectCatagories.findOne({
		name: category_name
	}, (err, category) => {
		if(err){
			console.log(err)
		}else{
			if(category){
				models.Projects.updateOne({
					_id: {$in: projectids}
				}, {
					category: category
				}).then(project => {
					console.log('Project has assigned a category.')
					return project
				}).catch(err => {
					console.log(err)
				})
			}
			
		}

		
	})
	
}

const createCategory = async (def='Others') => {
	
	return await new Promise((resolve, reject) => {
		models.ProjectCatagories.create({
			name: def
		}).then((docCategory) => {
			console.log(`Category: ${def} is created.`)
			resolve(docCategory)
		}).catch(err => {
			reject(err)
		})
	})

}

const updateProjectImage = (projectId, imageInstance) => {
	
}

module.exports = {
	findProjectById,
	createProject,
	updateProject,
	updateProjects,
	deleteProject,
	createCategory,
	updateProjectCategory
};
