const Controller = require('../controllers');
const {sessionChecker} = require("../middlewares/SessionMiddleware");
const express = require("express");
const router = express.Router();


USERNAME = "WolvezineX0";

router.get("/", sessionChecker, async (req, res) => {
    const user = await Controller.UserController.getPopulateProjects(req.session.user._id)
    res.render('index.jade', user) 

});

module.exports = router;
