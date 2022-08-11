const express = require('express')
const User = require('../model/authModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async(req,res,next)=>{
try{
    if(!req.body.Email || !req.body.Password || !req.body.Username){
        res.status(400)
        throw new Error('Fill all fields')
    }
   const {Username,Password,Email} = req.body
   const exisitingUser = await User.findOne({Email})
   if(exisitingUser){
       res.status(400)
       throw new Error('User already exists')
       
   }

   const seed = await bcrypt.genSalt(10)
   const hashedpassword = await bcrypt.hash(Password,seed)
   const userdata = await User.create({
       Username,
       Password:hashedpassword,
       Email
   })

   console.log(userdata)

   res.status(200).json({
       _id:userdata.id,
       Username:userdata.Username,
       Email:userdata.Email,
       Password:userdata.Password,
       Token:generateToken(userdata._id)
   })

}

catch(error){
    next(error)
}
}


const login = async(req,res,next)=>{
    try{
        if(!req.body.Email || !req.body.Password ){
            res.status(400)
            throw new Error('Fill all fields')
        }
       const {Password,Email} = req.body
       const exisitingUser = await User.findOne({Email:req.body.Email})
       if(exisitingUser && (await bcrypt.compare(Password,exisitingUser.Password))){
           res.status(200).json({
            _id:exisitingUser.id,
            Username:exisitingUser.Username,
            Email:exisitingUser.Email,
            Token:generateToken(exisitingUser._id)})
       }

       else{
           res.status(400)
           throw new Error('User does not exist')
       }
    }
    
    catch(error){
        next(error)
    }
    }

    const getme = async(req,res,next)=>{
        
    }

    const generateToken = (id) =>{
        return jwt.sign({id},'abc123',{expiresIn:'3d'})
    }

    module.exports = [register,login]