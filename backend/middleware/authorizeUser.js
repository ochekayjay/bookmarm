const jwt = require('jsonwebtoken')
const User = require('../model/authModel')




const protect = async(req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            // Get token from header
            token = req.headers.authorization.split(' ')[1]

            //verify token
            const decoded = jwt.verify(token,'abc123')

            //get user from the token
            req.user = await User.findById(decoded.id).select('-Password') 
            console.log(req.user.id)
            next()
        }
        catch(error){
            next(error)
        }
    }
}

module.exports = protect