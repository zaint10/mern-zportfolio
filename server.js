const path = require("path");
const root = path.join(__dirname);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const morgan = require("morgan");
const hbs = require("hbs");

const reduceOp = function(args, reducer){
    args = Array.from(args);
    args.pop(); // => options
    var first = args.shift();
    return args.reduce(reducer, first);
  };
  
hbs.registerHelper({
    eq  : function(){ return reduceOp(arguments, (a,b) => a === b); },
    ne  : function(){ return reduceOp(arguments, (a,b) => a !== b); },
    lt  : function(){ return reduceOp(arguments, (a,b) => a  <  b); },
    gt  : function(){ return reduceOp(arguments, (a,b) => a  >  b); },
    lte : function(){ return reduceOp(arguments, (a,b) => a  <= b); },
    gte : function(){ return reduceOp(arguments, (a,b) => a  >= b); },
    and : function(){ return reduceOp(arguments, (a,b) => a  && b); },
    or  : function(){ return reduceOp(arguments, (a,b) => a  || b); },
    json: function(obj){return JSON.stringify(obj)}
  });


require('dotenv').config()

// Import routes
const page = require(path.join(root, "./routes/page"));
const login = require(path.join(root, "./routes/login"));
const manage = require(path.join(root, "./routes/manage"));
const dashboardApi = require(path.join(root, "./routes/api"));
const fileUploadApi = require(path.join(root, "./routes/file-upload"));

// Import config and enviroment
const config = require(path.join(root, "config"));

const Database = require('./mongoDB');
const publicDirectoryPath = path.join(__dirname, `${config.static}`);


// Connect to DB
const MongoDB = new Database.mongoDB(process.env.DB_CONNECTION_URI).connect();

// Defining Main Router
const express = require("express");
const app = express();
app.locals.split = function(string){ return string.split(',') }
// Set app Views And Static Folder
app.set("views", `${path.join(root, config.views)}`);
app.use(express.static(publicDirectoryPath));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

// Define App View Engine
app.set("view engine", "jade");

app.set("view engine", "hbs");

// Define Server
const server = require("http").Server(app);
TWO_HOURS = 1000 * 60 * 60 * 2
SESS_LIFETIME = TWO_HOURS
app.use(
  session({
    name: 'sid',
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: true,
      secure: false
    }
    
  })
);

// Set routes
app.use("/", page);
app.use("/account", login);
app.use("/manage", manage);
app.use("/api/v1", dashboardApi);
app.use("/service/upload", fileUploadApi);





// set morgan to log info about our requests for development use.
app.use(morgan("dev"));

server.listen(process.env.PORT, () => {
  console.log('Server started. Listening on POST: ' + process.env.PORT)
});


// {"_id":{"$oid":"5fa71bdab771704be4875cbe"},"fname":"","lname":"","cname":"","ph_number":"","email":"","city":"","country":"","about_summary":"","position_title":"","projects":[],"link_github":"","link_linkedin":"","roles":[],"username":"WolvezineX0","password":"$2b$10$O2DRf3PMSNox5zZENvtD0uJ7zB59Jy5qJB19oobE0e7HVM0chrGB6","__v":0}