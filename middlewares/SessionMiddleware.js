let {Logger} = require("../utilities");

Logger = new Logger();
Logger.setLogName('request');
Logger.init();

const sessionChecker = (req, res, next) => {
	Logger.info('Silent Session Checker')
	
	if (req.session.user && req.session.loggedin) {
		
		Logger.info("Session is Valid.")
		next();
	} else {
		Logger.info("Invalid Session, Redirecting to authenticate")
		const url = new URL('https://' + req.get('host') + req.originalUrl)
		res.redirect("/account/login/" + process.env.USER_NAME + "?next=" + url);
	}
};

const pswdAuthenticateSessionChecker = (req, res, next) => {
	Logger.info("Password Authenticate Session Cheker");
	if (req.session.pwdLoggedIn) {
		Logger.info("Session is valid");
		next();
	} else {
		Logger.info("Invalid Session, Redirecting to login page");
		res.redirect("/account/login" + "?next=" + req.originalUrl);
	}
};

module.exports = { sessionChecker, pswdAuthenticateSessionChecker };
