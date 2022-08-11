const express = require('express');
const User = require('../model/authModel');
const Userbio = require('../model/bioModel')
const router = express.Router();
const protect = require('../middleware/authorizeUser')

router.get('/',protect, async(req,res,next)=>{
    try{
        const userInfo = await User.findById(req.user.id);
    if(!userInfo[0].Username){
        res.status(400)
        console.log(userInfo)
        throw new Error('user does not exist')
    }
    else{
        console.log(userInfo)
        res.status(200).send(userInfo)
    }
    
    }
    catch(error){
        next(error)
    }
    
})

router.post('/',protect,async(req,res,next)=>{
    console.log('first step in')
    try {
        if(!req.body.Usernamebio ){
            res.status(400)
            throw new Error('kindly fill all fields')
        }
        console.log('getting in')
        const user = await Userbio.create({
            Usernamebio: req.body.Usernamebio,
            userinfo: req.user.id
          
    
        })
            console.log('a')
            console.log(user)
            res.status(200).send(user)
    }

    
    


    catch(error){
        next(error)
    }
   
})


router.put('/:id',protect, async(req,res,next)=>{
    try{

        user = await User.findById(req.user.id)
        if(!user){
                res.status(400)
                throw new Error('User does not exist')
        }
    
        else{
            console.log(user)
            console.log(req.body)
            updatedUser = await User.findByIdAndUpdate(req.user.id,req.body,{new: true})
            console.log(updatedUser)
            res.json(updatedUser)
        }
       
    }

    catch(error){
        next(error)
    }
})

router.delete('/:id',async(req,res,next)=>{
    try{
        user = await User.findById(req.user.id)
        if(!user){
                res.status(400)
                throw new Error('User does not exist')
        }

        else{
            await user.remove()
            res.json({id:req.user.id})
        }
    }

    catch(error){
        next(error)
    }
})

module.exports = router