const express = require("express");
const {hasPermissions} = require('../authorization')
const Controller = require('../controllers');
const {sessionChecker, pswdAuthenticateSessionChecker} = require("../middlewares/SessionMiddleware");

const router = express.Router()

router.get('/', sessionChecker, pswdAuthenticateSessionChecker, async (req, res) => {
    
    if(!await hasPermissions(req.session.user, 'USERS', 'read')){
        res.send('You are not authorized to View Users Dashboard.')
    }else{
        const user = await Controller.UserController.getPopulateProjects(req.session.user._id)

        res.render('dashboard.hbs', {user: user})
    }
    
    
})


module.exports = router;