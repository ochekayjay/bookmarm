
const path = require("path");
const imageModel = require('../model/imageModel')
const fs = require('fs');


const urlconstant = 'https://savemyfile.onrender.com/avatar/'
const imageCreator = async(req,res,next)=>{
   console.log('inside image controller')
    try{
      if(!req.body.title || !req.body.source){
            
        res.status(400)
        throw new Error('kindly fill all fields')
       
        }
  
        else{
            console.log(req.body)
            console.log(req.file)
            console.log(req.headers)
            const imageobj = await imageModel.create({
             
        
              nameofimage : req.file.filename,
              title:req.body.title,
              source: req.body.source,
              user: req.user.id,
              folder: req.headers.folderid
            })

            res.json({
                      nameofimage:imageobj.nameofimage,
                      title:imageobj.title,
                      source: imageobj.source,
                      user: imageobj.user,
                      folder: imageobj.folder})
            
        
            
        }
    }
    catch(error){
      console.log(error)
        next(error)
    }
  
  }


  const getAllImagesinFolder = async(req,res,next)=>{
          const folderImages = await imageModel.find({folder:req.headers.folderid})

          res.json({folderImages:folderImages})

  }

  const getAllUserImages = async(req,res,next) =>{
          const userImages = await imageModel.find({userid:req.user.id})

          res.json({userImages:userImages})
  }


  const getOneImage = async(req,res,next)=>{
    const imageData = await imageModel.findById(req.params.id)
    //res.setHeader('Content-Type',imageData.imageType)
    console.log(req.params.id)
    res.send(imageData.image.buffer)
    /*console.log(imageData)
    res.send(imageData.image.buffer)
    res.end()*/
  }


  const deleteImage = async(req,res,next)=>{
  console.log('inside delete')
    const SpecificUser = req.user.id;
    const folderId = req.headers.folderid;
                try{
                        const imageFolder = await imageModel.findById(req.params.imageId)
                        console.log(imageFolder)
                        
                        fs.unlinkSync(path.join(__dirname,'..','..', 'public', 'avatar', `${imageFolder.nameofimage}`), err => {
                          if (err) throw err;
                        });
                      

                        await imageModel.findByIdAndDelete(req.params.imageId)

                        const folderImages = await imageModel.find({folderid:req.headers.folderid})

                        res.json({folderImages:folderImages})
                
  
          
          
                }
  
                catch(error){
                          next(error)
                }
   
                }

  module.exports = {imageCreator,getAllImagesinFolder,getAllUserImages,getOneImage,deleteImage}