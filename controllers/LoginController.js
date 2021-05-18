const User = require('../models/User')


const authentication = (req, res) => {
    const username = req.params.username
    
    return new Promise((resolve, reject) => {
        // Checking account for username
        User.findOne({username: username}).then(result => {
            if(result){
                resolve(result)
            }

            reject(new Error('Account does not exist against username: '+ username));
        }).catch(err =>{
            reject(err)
        })
    })
    
}

const authenticate = (username, password='') => {
    let response = {isAuthenticated: false, message: 'Username maybe incorrect'};
    
    return new Promise((resolve, reject) => {
        // Authenticating account for username

        User.findOne(
            {username: username}
        ).then(docUser => {
            // Authentication based on just username
            if(docUser){
                
                // Authentication based on if password also given
                if(password && !docUser.isValidPassword(password)){
                    response.isAuthenticated = false
                    response.message = 'Username or password maybe incorrect.'
                }else{
                    response.message = 'Username and password is correct'
                    response.isAuthenticated = true;
                }
            }
            response.user = docUser
            resolve(response)
            
        }).catch(err => {
            reject(err)
        })
    })
}

module.exports = {
    authentication,
    authenticate
}