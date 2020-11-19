const Controller = require("../controllers");
const utilities = require('../utilities')
const express = require("express");
const router = express.Router();

router.post("/user", async (req, res) => {
	const user = req.body;

	const userid = user._id;
	const projects = user["projects"];

	if (projects) {
		await Controller.ProjectController.updateProjects(projects);
	}

	await Controller.UserController.updateUser(userid, user);

	res.status(200).send("Details Updated.");
});

router.post("/projects", async (req, res) => {
	const userid = req.body.userId;
	const projects = req.body["projects"];

	if (projects) {
		createdProjects = await Controller.ProjectController.createProject(
			projects
		);
		await Controller.UserController.addProjects(userid, createdProjects);
	}
	console.log(createdProjects);
	res.status(200).send({ projects: createdProjects });
});

router.delete("/projects/:id", async (req, res) => {
	const pid = req.params.id;
	const userid = req.body.userId;
	await Controller.ProjectController.deleteProject(pid);
	await Controller.UserController.deleteProject(userid, pid);
	res.status(200).send({});
});

router.post("/create-project-image/:projectId", async(req, res) => {
	const {projectId} = req.params
	const {filename, filetype, key} = req.body.imageData 
	
	const fileurl =  `${utilities.S3_BASE_URL}/${key}`
	const docProject = await Controller.ProjectController.findProjectById(projectId)
	if(docProject){
		let newImage
		if(docProject.image){
			// Store old key before updating imagemetadata. This will be used to delete object from bucket.
			const oldKey = docProject.image.key
			newImage = await Controller.ImageMetadataController.updateImageMetadata(docProject.image._id, filename, filetype, key, fileurl)
		}else{
			newImage = await Controller.ImageMetadataController.createImageMetaData(filename, filetype, key, fileurl)
			
			
		}
		docProject.image = newImage
		docProject.save()
		console.log('Image is added in project.')
		res.status(200).send({success: true, message: 'Project image association is created.',imageName: docProject.image.name, imageUrl: docProject.image.url})
	}else{
		res.status(404).send({success: false, message: 'No Project is found for id: ' + projectId})
	}

})

router.put("/project-category/:projectid", async(req, res) => {
	const {projectid} = req.params;
	const {category} = req.body
	if(projectid && category){
		await Controller.ProjectController.updateProjectCategory([projectid], category);
		return res.status(200).send({success: true, message: 'Project category is updated.'});
	}
	
	return res.status(403)



})
module.exports = router;
