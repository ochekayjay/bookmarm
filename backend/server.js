const express = require('express');
const port = process.env.PORT || 5000;
const ConnectDB = require('./config/db');
const bodyParser = require('body-parser');
const path = require("path");
const { catchError } = require('./middleware/errorHandler');
const protect = require('./middleware/authorizeUser')
const File = require('./model/imageModel');
const fs = require('fs');
const imageModelTest = require('./model/newTestModel')
const multer = require('multer')

const app  = express();




app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );


  /*app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, '..', "views"));
  app.use(express.static(`${__dirname}/../public`));*/
ConnectDB()

/*app.use(express.json())
 app.use("/imagesend", (req, res) => {
  res.status(200).render("index");
});*/
 

/*const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const SpecificUser = req.params.userdet;
    
    fs.mkdir(path.join(__dirname,'..', `public/${SpecificUser}`), (err) => {
      if (err) {
          return console.error(err);
      }
      console.log('Directory created successfully!');
  });
    
    console.log(SpecificUser)
    cb(null, `public/${SpecificUser}`);
  },
  filename: (req, file, cb) => {
    console.log('b')
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "img"||"png") {
    console.log('d')
    cb(null, true);
  } else {
    console.log('e')
    cb(new Error("Not an Image"), false);
  }
};


const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});*/


/*app.use("/trial",  (req, res) => {
  res.status(200).render("check");
});*/

/*app.post('/imageUpload/:userdet',upload.single('myFile'),async(req,res,next)=>{

  try{
    if(!req.file.filename){
        res.status(400)
        console.log('error filled')
      throw new Error('Fill in image name')
    }
    else{
      
        const newFile = await imageModelTest.create({
          imageFolder: {nameofimage:req.file.filename,source:req.body.source,title:req.body.title},
        });
      
        console.log({file:req.file})
        console.log(newFile)  
    }
  }

    catch(error){
      next(error)
    }
})
*/







app.use('/bio',require('./ROUTES/bioStore'))
//app.use('/links',require('./ROUTES/linkStore'))
//app.use('/text',require('./ROUTES/textStore'))
app.use('/auth',require('./ROUTES/Auth pages/authentication'))
app.use('/folder',protect,require('./ROUTES/folderStore'))
app.use('/imageLink',require('./ROUTES/imageStore'))
app.use(catchError)
app.listen(port, ()=> console.log('in here'))