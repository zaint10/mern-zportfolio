const { RbacConroller, UserController, ProjectController } = require("../controllers");
const {
	sessionChecker,
	pswdAuthenticateSessionChecker,
} = require("../middlewares/SessionMiddleware");
const { hasPermissions } = require("../authorization");
const express = require("express");
const router = express();

router.get("/", async (req, res) => {
	res.send("Manage RBAC");
	const USERNAME = process.env.USER_NAME;
	await ProjectController.createDefaultCategory();

	// RbacConroller.createUserRoles(req.session.user._id, [
	// 	"BASIC_USER",
	// 	"SUPER_USER",
	// ])
	// 	.then((result) => {
	// 		console.log(result);
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 	});
});

router.get("/users", (req, res) => {});

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
					console.log(user)
					// return res.status(200).render("dashboard.hbs", { user: user });
					return res.status(200).render("dashboard.jade", { user: user });
				}

				res.status(404).send("No such username exist.");
			})
			.catch((err) => {
				res.status(400);
			});
	}
);

router.get("/rbac", (req, res) => {
	res.send("Manage RBAC");
	const USERNAME = process.env.USER_NAME;
	UserController.createUserWUsernameAndPassword("USERNAME", "zeestack10")
		.then((result) => {
			console.log(result);
		})
		.catch((err) => {
			console.log(err);
		});

	// RbacConroller.createRoles([{name: 'test'}]).then(result => {
	//     console.log(result)
	// }).catch(err => {
	//     console.log(err)
	// })
});

module.exports = router;
