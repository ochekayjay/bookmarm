
const path = require("path");
const imageModel = require('../model/imageModel')

const fs = require('fs');


const urlconstant = 'https://savemyfile.onrender.com/avatar/'
const imageCreator = async(req,res,next)=>{

    try{
      if(!req.body.title || !req.body.source){
            
        res.status(400).json({status:"error",message:"kindly fill all fields"})
        }
  
        else{
            
            const imageobj = await imageModel.create({
             
        
              nameofimage : req.file.filename,
              title:req.body.title,
              source: req.body.source,
              user: req.user.id,
              folder: req.headers.folderid
            })

            res.json({state:true,imagedata:{
                      nameofimage:imageobj.nameofimage,
                      title:imageobj.title,
                      source: imageobj.source,
                      user: imageobj.user,
                      folder: imageobj.folder}})
            
        
            
        }
    }
    catch(error){
      console.log(error)
        next(error)
    }
  
  }


  const getAllImagesinFolder = async(req,res,next)=>{
          const folderImages = await imageModel.find({folder:req.headers.folderid})
          if(folderImages[0]){
            res.json({state:true,imagedata:folderImages})
        }
        else{
            res.json({state:false,message:'No Image Data available!'})
        }
          

  }

  const getAllUserImages = async(req,res,next) =>{
          const userImages = await imageModel.find({user:req.user.id})

          if(userImages[0]){
            res.json({imagedata:userImages,state:true})
        }
        else{
            res.json({state:false,message:'No Image Data available!'})
        }
      
  }


  const getOneImage = async(req,res,next)=>{
    const imageData = await imageModel.findById(req.params.id)
    const bufferData = Buffer.from(imageData.image.buffer)
    res.setHeader('Content-Type',imageData.imageType)
    res.send(bufferData)
  }


  const deleteImage = async(req,res,next)=>{
    const SpecificUser = req.user.id;
    const folderId = req.headers.folderid;
                try{
                      

                        await imageModel.findByIdAndDelete(req.params.imageId)

                        const folderImages = await imageModel.find({folder:req.headers.folderid})

                        if(folderImages[0]){
                          res.json({state:true,imagedata:folderImages})
                        }
                        else{
                          res.json({state:false,message:'no image data available'})
                        }
                        
                
  
          
          
                }
  
                catch(error){
                          next(error)
                }
   
                }

  //search through image model

  const querySearchImage  = async(req,res,next)=>{
    console.log(req.params.user)
       //console.log(`${req.query.message} value`)
       try{
           
           await imageModel.find({userid:req.user.id}).lean()
           
       
           const foundData = await imageModel.aggregate([
        
           {$match:
               {$text: 
                   {$search: req.query.message,
                       $caseSensitive: false}} }
       
       ])       
       if(foundData[0]){
        res.json({state:true,imagedata:foundData})
           
       }
       else{
        res.json({state:false,message:"image not found!"})
   }
   }
       catch(error){
           next(error)
       }
   }


  module.exports = {imageCreator,getAllImagesinFolder,getAllUserImages,getOneImage,deleteImage,querySearchImage}