const sessionChecker = (req, res, next) => {
	console.log("Silent Session Checker...");
	
	if (req.session.user && req.session.loggedin) {
		console.log("Session is Valid.");
		next();
	} else {
		console.log("Invalid Session, Redirecting to authenticate...");
		res.redirect("/account/login/" + process.env.USER_NAME + "?next=" + req.originalUrl);
	}
};

const pswdAuthenticateSessionChecker = (req, res, next) => {
	console.log("Password Authenticate Session Cheker...");
	if (req.session.pwdLoggedIn) {
		console.log("Session is valid");
		next();
	} else {
		console.log("Invalid Session, Redirecting to login page...");
		res.redirect("/account/login" + "?next=" + req.originalUrl);
	}
};

module.exports = { sessionChecker, pswdAuthenticateSessionChecker };
