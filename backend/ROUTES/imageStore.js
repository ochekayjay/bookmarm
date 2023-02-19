const express = require('express')
const imageModel = require('../model/imageModel')
const router = express.Router()
const multer = require('multer')
const path = require("path");
const fs = require('fs');
const foldermodel = require('../model/folderModel');
const usermodel = require('../model/linkModel');
const { imageCreator,getAllImagesinFolder,getAllUserImages, getOneImage, deleteImage } = require('../controller/imageController');


//validate ids






//middleware for creating directory
const createdirectory = async(req,res,next)=>{
  //const imgModel = await imageModel.findOne({folderid:req.header.folderid}) 
  const SpecificUser = req.user.id;
  const folderId = req.headers.folderid;
console.log('a')
//if(!imgModel.path){
  fs.mkdir(path.join(__dirname,'..','..', 'public','imageCollection',`${SpecificUser}`,`${folderId}`), { recursive: true },(err) => {
    console.log(path.join(__dirname,'..','..', `public/imageCollection/${SpecificUser}/${folderId}`))
    console.log(__dirname)
    if (err) {
        return console.error(err);
    }
    console.log('Directory created successfully!');
});

//}

/*else{
  req.pathname = imgModel.path
}*/
  
  next()
}







const multerStorage = multer.diskStorage({
  
    destination: (req, file,cb) => {
      const SpecificUser = req.user.id;
      const folderId = req.headers.folderid;
      //cb(new Error("Not an Image"), true)
      cb(null, path.join(__dirname,'..','..', `public/imageCollection/${SpecificUser}/${folderId}`));
    },
    filename: (req, file, cb) => {
      
      const ext = file.mimetype.split("/")[1];
      cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
  });

  const multerFilter = (req, file, cb) => {
    const mimetypes = ["jpeg","png","JPG"]
    if (!mimetypes.includes(file.mimetype.split("/")[1]) ) {
      console.log(file.mimetype.split("/")[1])
      cb(new Error("Not an Image"), false);
    } else {
      console.log('in multer else')
      cb(null, true)
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });




router.post('/imagePush',createdirectory,upload.single('myFile'),imageCreator)

router.get('/getFolderImages', getAllImagesinFolder)

router.get('/getUserImages', getAllUserImages)

router.get('/getImage/:id', getOneImage)

router.delete('/:imageId', deleteImage)



module.exports = router





/* 

contains function to delete all images in a folder
  const updatedImageHolder = await imageModel.findOneAndUpdate({_id:req.imageId},
            {

                $pull:   {imageFolder:{_id:req.params.specificImageId}
                    }
                },
                {new : true})
                const direct = path.join(__dirname,'..','..', `public/imageCollection/${folderId}/${SpecificUser}`)
                fs.readdir(direct, (err, files) => {
                  if (err) throw err;
                
                  for (const file of files) {
                    if(req.query.imagename === file){
                      console.log('b')
                      fs.unlink(path.join(__dirname,'..','..', `public/imageCollection/${folderId}/${SpecificUser}/${file}`), err => {
                        if (err) throw err;
                      });
                    }
                  }
                });

*/