const express = require('express');
const User = require('../model/authModel');
const Userbio = require('../model/bioModel')
const router = express.Router();
const protect = require('../middleware/authorizeUser')
const multer = require('multer')


const imageSetter = (req,res,next)=>{

}


//create directory to store user images in user profile
const createdirectory = async(req,res,next)=>{
  const SpecificUser = req.user.id;
  const userInfo = await Userbio.find({userid:req.user.id});
  if(userInfo){
    fs.rmdir(path.join(__dirname,'..','..','public','bio',`${SpecificUser}`),{ recursive: true },(err) => {
      //console.log(path.join(__dirname,'..','..', `public/${SpecificUser}`))
      console.log(__dirname)
      if (err) {
          return console.error(err);
      }
      console.log('Directory deleted successfully!');
  })
  }
    
    
  console.log('a')
    fs.mkdir(path.join(__dirname,'..','..', 'public','bio',`${SpecificUser}`), { recursive: true },(err) => {
      //console.log(path.join(__dirname,'..','..', `public/${SpecificUser}`))
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
      const SpecificUser = req.user.id; 
      cb(null, path.join(__dirname,'..','..', `public/bio/${SpecificUser}`));
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


//post-request to post an image as avatar on the user bio
router.post('/imagePush',createdirectory,upload.single('myFile'),async(req,res,next)=>{
  try{
    
    const biodata = await Userbio.find({userinfo:req.user.id})

    if(biodata){

      const updatedImageHolder = await Userbio.findOneAndUpdate({userinfo:req.user.id},
        {
  
            $set:   {"avatarName":req.file.filename,
                }
            },
            {new : true})
            res.json(updatedImageHolder)
    }

    else{
      const folderfile = await Userbio.create({
                
        avatarName:req.file.filename,
        userinfo:req.user.id,
       
    })

    res.status(200).json(folderfile)}
 
}
catch(error){
  next(error)
}
})


//post-request to update username of user ono user bio
router.post('/usernamePush',async(req,res,next)=>{
  try{
    

    if(req.body.Usernamebio){
      const biodata = await Userbio.find({userinfo:req.user.id})

      if(biodata){
        console.log('a')
        const updatedImageHolder = await Userbio.findOneAndUpdate({userinfo:req.user.id},
          {
  
              $set:   {"Usernamebio":req.body.Usernamebio,
                  }
              },
              {new : true})
      console.log(updatedImageHolder)
      res.json(updatedImageHolder)
      }

      else{
        console.log('b')
        const folderfile = await Userbio.create({
                
          Usernamebio:req.body.Usernamebio,
          userinfo:req.user.id,
         
      })

      res.status(200).json(folderfile)}
      
    }
  }
  catch(error){
    next(error)
  }
})
  
//get-request to get link of image to view the image
router.get('/bioUpdate', async(req,res,next)=>{
    try{
        const userInfo = await Userbio.find({userinfo:req.user.id});
    if(!userInfo || !userInfo.avatarName){
        res.send('../../public/avatar/freeAvatar.png')
    }
    else{
        
        res.status(200).send(`../../public/bio/${req.user.id}/${userInfo.avatarName}}`)
    }
    
    }
    catch(error){
        next(error)
    }
    
})

router.delete('/imagedelete',async(req,res,next)=>{
    try{

      const bioHolder = await Userbio.findOne({userinfo:req.user.id})
       console.log(bioHolder)
       for(let i=0; i<imageHolder.imageFolder.length;i++){
        if (bioHolder.avatarName === req.query.imagename){
          console.log('a')
            const imageHold = bioHolder.imageFolder
            imgArray = imageHold.splice(i,1)
        }
    }}
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