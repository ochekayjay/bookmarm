const express = require('express')
const imageModel = require('../model/imageModel')
const router = express.Router()
const multer = require('multer')
const path = require("path");
const fs = require('fs');
const foldermodel = require('../model/folderModel');
const usermodel = require('../model/userStoreModel');
const { json } = require('body-parser');
const { Console } = require('console');

//validate ids

const idvalidator = async(req,res,next)=>{
  console.log('a')
  const userid = await usermodel.findOne({id:req.params.userid})
  const folderid = await foldermodel.findOne({id:req.params.folderid})

  if(!userid){
    res.json({error:'User does not exist'})
  }

  else if(!folderid){
    res.json({error:'Folder does not exist'})
  }

  next()
}

const createLink = async(req,res,next)=>{
  const imageholder = await imageModel.findOne({id:req.params.imageFolderid})
  req.imageId = imageholder._id
  next()
}


//middleware for creating directory
const createdirectory = (req,res,next)=>{
  const SpecificUser = req.params.userid;
  const folderId = req.params.folderid;
console.log('a')
  fs.mkdir(path.join(__dirname,'..','..', 'public',`${SpecificUser}`,`${folderId}`), { recursive: true },(err) => {
    console.log(path.join(__dirname,'..','..', `public/${SpecificUser}/${folderId}`))
    console.log(__dirname)
    if (err) {
        return console.error(err);
    }
    console.log('Directory created successfully!');
});

  next()
}







const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const SpecificUser = req.params.userid;
      const folderId = req.params.folderid;
     
      cb(null, path.join(__dirname,'..','..', `public/${SpecificUser}/${folderId}`));
    },
    filename: (req, file, cb) => {
      
      const ext = file.mimetype.split("/")[1];
      cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
  });

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "img"||"png") {
    
      cb(null, true);
    } else {
    
      cb(new Error("Not an Image"), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

/*router.post('/:userid/:folderid/imageUpload',createdirectory,upload.single('myFile'),async(req,res,next)=>{

  try{
    if(!req.file.filename){
        res.status(400)
      
      throw new Error('Fill in image name')
    }
    else{
        const newFile = await imageModel.create({
          imageFolder: {nameofimage:req.file.filename,source:req.body.source,title:req.body.title},
          user: req.params.userid,
          folder:req.params.folderid
        });
        console.log({file:req.file})
        console.log(newFile)  
    }
  }

    catch(error){
      next(error)
    }
})*/


router.post('/:userid/:folderid/imagePush',createdirectory,createLink,upload.single('myFile'),async(req,res,next)=>{
  try{
      const folderHolder = await foldermodel.findOne({_id:req.params.folderid})
      if(!folderHolder){
          res.status(400)
          throw new Error('this folder does not exist')
      }
      else{
         const {title ,source} = req.body
         const holder = {title,source,nameofimage:req.file.filename}
         
          const updatedImageHolder = await imageModel.findOneAndUpdate({_id:req.imageId},
              {

                  $push:   {"imageFolder":holder,
                      }
                  },
                  {new : true})
      
          res.json(updatedImageHolder)
          
      }
  }
  catch(error){
      next(error)
  }

})


router.post('/:userid/:folderid/:imageFolderid/removeImage',createLink,async(req,res,next)=>{

  const SpecificUser = req.params.userid;
  const folderId = req.params.folderid;
  let imgArray;

  try{
    const folderHolder = await foldermodel.findOne({_id:req.params.folderid})
    if(!folderHolder){
        res.status(400)
        throw new Error('this folder does not exist')
    }
    else{
       const imageHolder = await imageModel.findOne({_id:req.imageId})
       console.log(imageHolder.imageFolder)
       for(let i=0; i<imageHolder.imageFolder.length;i++){
        if (imageHolder.imageFolder[i].nameofimage === req.query.imagename){
          console.log('a')
            const imageHold = imageHolder.imageFolder
            imgArray = imageHold.splice(i,1)
        }
       }
       
        const updatedImageHolder = await imageModel.findOneAndUpdate({_id:req.imageId},
            {

                $pull:   {imageFolder:imgArray[0],
                    }
                },
                {new : true})
                const direct = path.join(__dirname,'..','..', `public/${SpecificUser}/${folderId}`)
                fs.readdir(direct, (err, files) => {
                  if (err) throw err;
                
                  for (const file of files) {
                    if(req.query.imagename === file){
                      console.log('b')
                      fs.unlink(path.join(__dirname,'..','..', `public/${SpecificUser}/${folderId}/${file}`), err => {
                        if (err) throw err;
                      });
                    }
                  }
                });
    
        res.json(updatedImageHolder)

        
        
    }
}
catch(error){
    next(error)
}

  
})

module.exports = router