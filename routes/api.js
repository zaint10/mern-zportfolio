const Controller = require("../controllers");
const utilities = require("../utilities");
const express = require("express");
let { Logger } = require("../utilities");

const router = express.Router();
Logger = new Logger();
Logger.setLogName("portfolio_apis");
Logger.init();

router.post("/user", async (req, res) => {
	Logger.info("Updating User's potfolio details.");
	const user = req.body;

	const userId = user._id;
	const projects = user["projects"];

	if (projects) {
		await Controller.ProjectController.updateProjects(projects)
			.then(() => {
				Logger.info("User's projects details are updated.");
			})
			.catch((err) => {
				Logger.info(err);
			});
	}

	await Controller.UserController.updateUser(userId, user)
		.then((docUser) => {
			Logger.info(`Details are updated. user: ${docUser._id}`);
			res.status(200).send("Details are Updated.");
		})
		.catch((err) => {
			Logger.info(err);
		});
});

router.post("/projects", async (req, res) => {
	Logger.info("Creating new projects.");

	const userId = req.body.userId;
	const projects = req.body["projects"];

	if (projects) {
		createdProjects = await Controller.ProjectController.createProjects(
			projects
		).catch((err) => {
			Logger.error(err);
			return res.status(400).send({ message: "Somethjing Went Wrong." });
		});
		
		Logger.info(`Projects are created. Assigning projects to user: ${userId}`);
		await Controller.UserController.addProjects(userId, createdProjects)
			.then(async () => {
				Logger.info(`Projects are assigned.`);
				createdProjects = await Controller.ProjectController.findProjectByIds(createdProjects)
				res.status(200).send({ projects: createdProjects });
			})
			.catch((err) => {
				Logger.error(err);
				res.status(400).send({ message: 'Something went wrong.' });
			});
	}
});

router.delete("/projects/:id", async (req, res) => {
	Logger.info("Deleting a project");
	const pid = req.params.id;
	const userId = req.body.userId;
	let isProjectDeleted = false;
	await Controller.ProjectController.deleteProject(pid)
		.then(() => {
			Logger.info(`Project is deleted: id: ${pid}`);
			isProjectDeleted = true;
		})
		.catch((err) => {
			Logger.error(err);
		});
	if (isProjectDeleted) {
		return await Controller.UserController.deleteProject(userId, pid)
			.then((docUser) => {
				Logger.info(`Project ref deleted from User: ${docUser._id}`);
				return res
					.status(200)
					.send({ message: "Project is deleted for user." });
			})
			.catch((err) => {
				Logger.error(err);
			});
	}

	res.status(400).send({ message: "Something went wrong." });
});

router.post("/create-project-image/:projectId", async (req, res) => {
	Logger.info("Adding project image.");
	const { projectId } = req.params;
	const { filename, filetype, key } = req.body.imageData;

	const fileurl = `${utilities.S3_BASE_URL}/${key}`;
	const docProject = await Controller.ProjectController.findProjectById(
		projectId
	);
	if (docProject) {
		let newImage;
		if (docProject.image) {
			// Store old key before updating imagemetadata. This will be used to delete object from bucket.
			const oldKey = docProject.image.key;
			newImage = Controller.ImageMetadataController.updateImageMetadata(
				docProject.image._id,
				filename,
				filetype,
				key,
				fileurl
			);
		} else {
			newImage = Controller.ImageMetadataController.createImageMetaData(
				filename,
				filetype,
				key,
				fileurl
			);
		}
		return await newImage
			.then((docImage) => {
				Logger.info(`Image metadata is updated: ${docImage._id}`);
				docProject.image = docImage;
				docProject.save();
				Logger.info("Image is added in project.");
				return res.status(200).send({
					success: true,
					message: "Project image association is created.",
					imageName: docProject.image.name,
					imageUrl: docProject.image.url,
				});
			})
			.catch((err) => {
				Logger.error(err);
			});
	} else {
		res.status(404).send({
			success: false,
			message: "No Project is found for id: " + projectId,
		});
	}
});

router.put("/project-category/:projectid", async (req, res) => {
	Logger.info("Assigning a category to project.");
	const { projectid } = req.params;
	const { category } = req.body;
	if (projectid && category) {
		await Controller.ProjectController.updateProjectCategory(
			[projectid],
			category
		);
		return res
			.status(200)
			.send({ success: true, message: "Project category is updated." });
	}

	return res.status(403);
});
module.exports = router;
