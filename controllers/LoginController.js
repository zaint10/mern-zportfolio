const User = require('../models/User')


const authentication = (req, res) => {
    const username = req.params.username
    
    return new Promise((resolve, reject) => {
        console.log('Checking account for username: ' + username)
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
        console.log(`Authenticating account for username: ${username}`);

        User.findOne(
            {username: username}
        ).then(docUser => {
            // Authentication based on just username
            if(docUser){
                response.isAuthenticated = true;
               
                // Authentication based on if password also given
                if(password && !docUser.isValidPassword(password)){
                    isAuthenticated = false
                    response.message = 'Username or password maybe incorrect.'
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