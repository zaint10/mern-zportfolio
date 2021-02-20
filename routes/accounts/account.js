const LoginController = require("../../controllers/LoginController");
let { Logger } = require("../../utilities");

const express = require("express");
const router = express.Router();
Logger = new Logger();
Logger.setLogName("request");
Logger.init();

// Login Api
router.get("/login", (req, res) => {
	Logger.info("Login Router is called.");
	res.render("login.hbs");
});

// Silent logging
router.get("/login/:username", (req, res) => {
	const username = req.params.username;
	Logger.info(
		`Trying to silently log-in the user: ${username}. No password is required.`
	);

	LoginController.authentication(req, res)
		.then((user) => {
			Logger.info(`User is logged in: ${username}`);

			// Setting Session Variables.
			req.session.loggedin = true;
			req.session.username = username;
			req.session.user = user;

			// Redirecting to OriginalURL
			if (req.query.next == undefined || req.query.next === "/") {
				res.redirect("/");
			} else {
				res.redirect(req.query.next);
			}
		})
		.catch((err) => {
			Logger.error(err);
		});
});

router.post("/login", (req, res) => {
	const { username, password } = req.body;
	Logger.info(`Trying to log-in the user: ${username}`);
	let nextRedirect = "/";
	if (username && password) {
		LoginController.authenticate(username, password)
			.then((response) => {
				if (response.user) {
					if (response.isAuthenticated) {
						Logger.info(`User is logged in: ${username}`);

						// Setting Session Variables.

						req.session.loggedin = true;
						req.session.username = username;
						req.session.user = response.user;

						// Set session to distinguish between silent login and form login
						req.session.pwdLoggedIn = true;

						return res.status(200).send({
							success: response.isAuthenticated,
							message: response.message,
							nextRedirect: nextRedirect,
						});
					} else {
						Logger.info(
							`User is not authorized. Credentials may be incorrect: ${username}`
						);
						return res.status(401).send({
							success: response.isAuthenticated,
							message: response.message,
						});
					}
				}
				Logger.error(`No such account exists: ${username}`);
				res.status(404).send({ success: false, message: "No account exists." });
			})
			.catch((err) => {
				Logger.error(err);
			});
	} else {
		res
			.status(400)
			.send({ success: false, message: "Request body cannot be empty." });
	}
});

// Signup Api
// --

module.exports = router;
