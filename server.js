const path = require("path");
const root = path.join(__dirname);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const morgan = require("morgan");
const hbs = require("hbs");

const reduceOp = function (args, reducer) {
	args = Array.from(args);
	args.pop(); // => options
	var first = args.shift();
	return args.reduce(reducer, first);
};

hbs.registerHelper({
	eq: function () {
		return reduceOp(arguments, (a, b) => a === b);
	},
	ne: function () {
		return reduceOp(arguments, (a, b) => a !== b);
	},
	lt: function () {
		return reduceOp(arguments, (a, b) => a < b);
	},
	gt: function () {
		return reduceOp(arguments, (a, b) => a > b);
	},
	lte: function () {
		return reduceOp(arguments, (a, b) => a <= b);
	},
	gte: function () {
		return reduceOp(arguments, (a, b) => a >= b);
	},
	and: function () {
		return reduceOp(arguments, (a, b) => a && b);
	},
	or: function () {
		return reduceOp(arguments, (a, b) => a || b);
	},
	json: function (obj) {
		return JSON.stringify(obj);
  },
  truncate: function(string, words){
    return string.split(0, words)
  }
});


require("dotenv").config();

// Import routes
const home_page = require(path.join(root, "./routes/home-page"));
const accountApis = require(path.join(root, "./routes/accounts/"));
const manage_portfolio = require(path.join(root, "./routes/manage_portfolio"));
const portfolioApis = require(path.join(root, "./routes/api"));
const fileUploadApi = require(path.join(root, "./routes/file-upload"));

// Import config and enviroment
const config = require(path.join(root, "config"));

const Database = require("./mongoDB");
const publicDirectoryPath = path.join(__dirname, `${config.static}`);


// Defining Main Router
const express = require("express");
const app = express();

app.locals.split = function (string) {
	return string.split(",");
};

// Set app Views And Static Folder
app.set("views", `${path.join(root, config.views)}`);
app.use(express.static(publicDirectoryPath));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("trust proxy", 1);
// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

// Define App View Engine
app.set("view engine", "jade");

app.set("view engine", "hbs");


// Define Server
const server = require("http").Server(app);
TWO_HOURS = 1000 * 60 * 60 * 2;
SESS_LIFETIME = TWO_HOURS;

app.use(
	session({
		name: "zid",
		secret: "roar",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: SESS_LIFETIME,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true
		},
	})
);

app.use("/", home_page);

app.use("/account", accountApis);
app.use("/manage_portfolio", manage_portfolio);
app.use("/api/v1", portfolioApis);
app.use("/service/upload", fileUploadApi);

// set morgan to log info about our requests for development use.
app.use(morgan("dev"));
const port = process.env.PORT || 5000;

server.listen(port, (err) => {
  // Connect to DB
  new Database.mongoDB(process.env.DB_CONNECTION_URI).connect();
  
  if(process.env.NODE_ENV !== "production"){
    console.log("Server started. Listening on PORT: " + port);
    console.log(`http://127.0.0.1:${port}/`);
  }

});


// {"_id":{"$oid":"5fa71bdab771704be4875cbe"},"fname":"","lname":"","cname":"","ph_number":"","email":"","city":"","country":"","about_summary":"","position_title":"","projects":[],"link_github":"","link_linkedin":"","roles":[],"username":"WolvezineX0","password":"$2b$10$O2DRf3PMSNox5zZENvtD0uJ7zB59Jy5qJB19oobE0e7HVM0chrGB6","__v":0}