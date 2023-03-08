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
  console.log('first a')
  //const imgModel = await imageModel.findOne({folderid:req.header.folderid}) 
  const SpecificUser = req.user.id;
  const folderId = req.headers.folderid;
console.log('a')
//if(!imgModel.path){
  if(!fs.existsSync(path.join(__dirname,'..','..', 'public','imagesCollection',`${SpecificUser}`,`${folderId}`))){

    fs.mkdirSync(path.join(__dirname,'..','..', 'public','imagesCollection',`${SpecificUser}`,`${folderId}`), { recursive: true },(err) => {
      console.log(path.join(__dirname,'..','..', `public/imagesCollection/${SpecificUser}/${folderId}`))
      console.log(__dirname)
      if (err) {
          return console.error(err);
      }
      console.log('Directory created successfully!');
      next()
  });
  }

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
      
      cb(null, path.join(__dirname,'..','..', 'public','imagesCollection',`${SpecificUser}`,`${folderId}`));
    },
    filename: (req, file, cb) => {
      
      const ext = file.mimetype.split("/")[1];
      cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
  });

  const multerFilter = (req, file, cb) => {
    console.log('in multer filter')
    const mimetypes = ["jpeg","png","JPG"]
    
    if (!mimetypes.includes(file.mimetype.split("/")[1]) ) {
      console.log(file.mimetype.split("/")[1])
      cb(new Error("Not an Image"), false);
    } else {
      console.log('in multer else')
      console.log(req.file)
      cb(null, true)
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });




router.post('/imagePush',createdirectory,upload.single('myFile'),async(req,res,next)=>{
  const urlconstant = 'https://savemyfile.onrender.com/imagesCollection/'
  console.log('inside image controller')
   try{
     if(!req.body.title || !req.body.source){
           
       res.status(400)
       throw new Error('kindly fill all fields')
      
       }
 
       else{
           console.log(req.body)
           //console.log(file)
          
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
                     folder: imageobj.folder,
                    })
           
       
           
       }
   }
   catch(error){
     console.log(error)
       next(error)
   }
 
 })

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