const express = require('express')
const  [ linkObject,textObject ]  = require('../model/userStoreModel')
const router = express.Router()
const protect = require('../middleware/authorizeUser')
const folderModel = require('../model/folderModel')
const mongoose = require('mongoose')
const linkingid = mongoose.Types.ObjectId

//middleware to get the id of the textholder
const createLink = async(req,res,next)=>{
    const textholder = await textObject.findOne({folderid:req.query?.folder})
    const folderholder = await folderModel.findById(req.query?.folder)
    console.log(folderholder.textId)
    console.log(textholder)
    console.log(folderholder)
    if(folderholder.textId===undefined || textholder=== null){
        const textData =   await textObject.create({
            folderid:req.query.folder,
            userid: req.user.id
        })
        req.textId = textData._id
        next()
    }
    else{
        req.textId = textholder._id
        console.log('found text id')
        console.log(req.textId)
        next()
    }

}

router.get('/:id', async(req,res,next)=>{
    
    try{
        
    const textFolder = await textObject.findById(req.params.id);
    if(!textFolder){
        
        res.status(400).send('this folder does not exist')
    }
    else{
        res.status(200).json({textFolder:textFolder,success:true})
    }
    }

    catch(error){
        next(error)
    }
    
})



router.post('/', async (req,res,next)=>{
    console.log(req.body)
    try{
        if(!req.body.textholder.text || !req.body.textholder.description || !req.body.textholder.title || !req.body.textholder.source){
          
            res.status(400)
            throw new Error('kindly fill all fields')
           
        }
        else{

            
                const {link, description ,title ,source} = req.body.linkholder
                const holder = {text,description,title,source}

                const updatedText = await textObject.findOneAndUpdate({_id:req.textId},
                    {
    
                        $push:   {"textholder":holder,
                            }
                        },
                        {new : true})
            
                
                const linkparam = linkingid(updatedText._id)
                const linkContainer = await folderModel.findByIdAndUpdate(req.query?.folder,{textId:linkparam},{new:true}).populate('textId')
                //res.json({updatedLink:updatedLink,success:true})
                res.json({linkContent:linkContainer,success:true})
            
        }

            
    }
    catch(error){
        next(error)
    }

})


router.put('/',createLink,async(req,res,next)=>{
    try{
        const linkdata = await folderModel.findOne({_id:req.idholder})
        if(!linkdata){
            res.status(400)
            throw new Error('this folder does not exist')
        }
        else{
           const {text , description ,title ,source} = req.body.textholder
           const holder = {text,description,title,source}
           
            const updatedText = await textObject.findOneAndUpdate({_id:req.textId},
                {

                    $push:   {"textholder":holder,
                        }
                    },
                    {new : true})
        
            res.json(updatedText)
            
        }
    }
    catch(error){
        next(error)
    }

})



router.delete('/:id', async(req,res,next)=>{
    try{
        const textdata = await textObject.find()
        console.log(textdata)
        if(!textdata){
            res.status(400)
            throw new Error('this link does not exist')
        }
        else{
           const textUpdated =  await textObject.updateOne({userid:req.user.id},{
                $pull:{textholder:{_id:req.params.id}}
            })
            res.json(textUpdated)
        }
    }
    catch(error){
        next(error)
    }

})

module.exports = router