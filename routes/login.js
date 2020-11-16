const LoginController = require("../controllers/LoginController");
const express = require("express");
const router = express.Router();


router.get("/login", (req, res) => {
	console.log("Login Router...");
	res.render('login.hbs')
});

// Silent logging
router.get("/login/:username", (req, res) => {
	console.log("Login Router...");
	const username = req.params.username;
	LoginController.authentication(req, res)
		.then((user) => {
			console.log(`Logged In now.`);

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
			console.log(err);
		});
});

router.post("/login", (req, res) => {
	console.log("Login Router...");
	const { username, password } = req.body;
	let nextRedirect = "/";
	if (username && password) {
		LoginController.authenticate(username, password)
			.then((response) => {
				if (response.user) {
					if (response.isAuthenticated) {
						// Setting Session Variables.
						req.session.loggedin = true;
						req.session.username = username;
						req.session.user = response.user;
						// Set session to distinguish between silent login and form login
						req.session.pwdLoggedIn = true;
					}

					return res.status(200).send({
						success: response.isAuthenticated,
						message: response.message,
						nextRedirect: nextRedirect,
					});
				}

				res.status(404).send({ success: false, message: "No account exists." });
			})
			.catch((err) => {
				console.log(err);
			});
	}else{
		res.status(404 ).send({success: false, message: 'No form data passed'})
	}
});


module.exports = router;
