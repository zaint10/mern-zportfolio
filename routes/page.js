const Controller = require('../controllers');
const utilities = require('../utilities')
const {sessionChecker} = require("../middlewares/SessionMiddleware");
const express = require("express");
const router = express.Router();


USERNAME = "WolvezineX0";

router.get("/", sessionChecker, async (req, res) => {
    const user = await Controller.UserController.getPopulateProjects(req.session.user._id)
    const categorizedProjects = utilities.getCategorizedProjects(user.projects)
    console.log(categorizedProjects)
    res.render('index.jade', {user: user, projects: categorizedProjects}) 

});

module.exports = router;
