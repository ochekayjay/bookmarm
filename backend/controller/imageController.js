
const path = require("path");
const imageModel = require('../model/imageModel')
const fs = require('fs');


const urlconstant = 'https://savemyfile.onrender.com/imageCollection/'
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
             
              path: `${urlconstant}/${req.user.id}/${req.headers.folderid}/${req.file.filename}`,
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
          const folderImages = await imageModel.find({folderid:req.headers.folderid})

          res.json({folderImages:folderImages})

  }

  const getAllUserImages = async(req,res,next) =>{
          const userImages = await imageModel.find({userid:req.user.id})

          res.json({userImages:userImages})
  }


  const getOneImage = async(req,res,next)=>{
    const imageData = await imageModel.findById(req.params.id)
    res.json(imageData)
  }


  const deleteImage = async(req,res,next)=>{
  console.log('inside delete')
    const SpecificUser = req.user.id;
    const folderId = req.headers.folderid;
                try{
                        const imageFolder = await imageModel.findById(req.params.imageId)
                        console.log(imageFolder)
                        const dat = path.join(__dirname,'..','..', 'public', 'imageCollection', `${SpecificUser}`, `${folderId}`, `${imageFolder.nameofimage}`);
                        console.log(dat)
                        fs.unlink(path.join(__dirname,'..','..', 'public', 'imageCollection', `${SpecificUser}`, `${folderId}`, `${imageFolder.nameofimage}`), err => {
                          if (err) throw err;
                        });
                      

                        imageFolder.remove()
                        res.json({message:'deleted sucessfully',success:true})
  
          
          
                }
  
                catch(error){
                          next(error)
                }
   
                }

  module.exports = {imageCreator,getAllImagesinFolder,getAllUserImages,getOneImage,deleteImage}