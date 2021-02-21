
const {
	UserController,
	ProjectController,
	ProjectCategoriesController,
} = require("../controllers");

const {
	pswdAuthenticateSessionChecker,
} = require("../middlewares/SessionMiddleware");

const { hasPermissions } = require("../authorization");
const express = require("express");
let {Logger} = require("../utilities");

const router = express();
Logger = new Logger();
Logger.setLogName('manage_portfolio');
Logger.init();

router.get("/", async (req, res) => {
	res.send("Manage RBAC");
	const USERNAME = process.env.USER_NAME;
	// await ProjectController.createCategory("MERN");
	// await ProjectController.createCategory("Python/Desktop Apps");
	// await ProjectController.createCategory("Android/Java");

	// RbacConroller.createUserRoles(req.session.user._id, [
	// 	"BASIC_USER",
	// 	"SUPER_USER",
	// ])
	// 	.then((result) => {
	// 		
	// 	})
	// 	.catch((err) => {
	// 		
	// 	});
});

router.get(
	"/users/:username",
	pswdAuthenticateSessionChecker,
	async (req, res) => {
		const { username } = req.params;
		if (!(await hasPermissions(req.session.user, "USERS", "read"))) {
			return res
				.status(401)
				.send("You are not authorized to View Users Dashboard.");
		} else if (req.session.user.username != username) {
			if (!(await hasPermissions(req.session.user, "USERS", "view_all"))) {
				return res
					.status(401)
					.send("You are not authorized to View other User's Dashboard.");
			}
		}

		let user = {};
		await UserController.getByUsername(username)
			.then(async (docUser) => {
				if (docUser) {
					user = await UserController.getPopulateProjects(docUser._id);
					const projectcategories = await ProjectCategoriesController.getAllCategories();

					return res.status(200).render("dashboard.jade", {
						user: user,
						categories: projectcategories,
					});
				}

				res.status(404).send("No such username exist.");
			})
			.catch((err) => {
				Logger.error(err);
				res.status(400);
			});
	}
);

module.exports = router;
