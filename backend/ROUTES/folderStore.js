const express = require('express')
const folderModel = require('../model/folderModel')
const [ linkObject ] = require('../model/userStoreModel')
const protect = require('../middleware/authorizeUser')
const router = express.Router()
const mongoose = require('mongoose')
const linkingid = mongoose.Types.ObjectId


const redirect = (req,res,next)=>{
    req.idholder = req.params.id
    next()
}

const createLink = async(req,res,next)=>{
    const linkholder = await linkObject.findOne({userid:req.user.id})
    console.log(linkholder)
    req.linkId = linkholder._id
    next()
}

router.get('/',async (req,res,next)=>{
    try{
        const folderdata = await folderModel.find({userid:req.user.id}).populate(['linkId','imageId','textId'])
        if(folderdata){
            res.status(200).json(folderdata)
        }
        else{
            res.status(400)
            throw new Error ('folder does not exist')
        }
    }
    catch(error){
        next(error)
    }
})

router.post('/', async (req,res,next)=>{
    try{
        if(!req.body.name){
            res.status(400)
            throw new Error('fill-in name of folder')
        }
        else{
          
            const name = req.body.name
          

            const folderfile = await folderModel.create({
                
                name:name,
                userid:req.user.id,
                linkid:req?.linkId
            })

            res.status(200).json(folderfile)
        }
    }
    catch(error){
        next(error)
    }
})

router.get('/:folder/link/:link', async (req,res,next)=>{
    try{
        const linkparam = linkingid(req.params.link)
        const linkContainer = await folderModel.findByIdAndUpdate(req.params.folder,{linkId:linkparam},{new:true}).populate('linkId')
        res.json(linkContainer)
    }
    catch(error){
        next(error)
    }
})

router.get('/:folder/text/:text', async (req,res,next)=>{
    try{
        const linkparam = linkingid(req.params.text)
        const linkContainer = await folderModel.findByIdAndUpdate(req.params.folder,{textId:linkparam},{new:true}).populate('textId')
        
        res.json(linkContainer)
    }
    catch(error){
        next(error)
    }
})


router.get('/:folder/img/:img', async (req,res,next)=>{
    try{
        const linkparam = linkingid(req.params.img)
        const linkContainer = await folderModel.findByIdAndUpdate(req.params.folder,{imageId:linkparam},{new:true}).populate('imageId')
    

        res.json(linkContainer)
    }
    catch(error){
        next(error)
    }
})


/*router.put('/:id', async (req,res,next)=>{
    try{
        const folderresult = await folderModel.find({userid:req.user.id})
        if(!folderresult){
            res.status(400).json('Folder does not exist')
        }
        else{
            const { folderLink,folderText} = req.body.folderholder
            let name = req.body.name
            let folderlinkholder = {
                link:folderLink.link,
                description: folderLink.title,
                title: folderLink.title,
                source: folderLink.source
            }
            let foldertextholder = {
                text:folderText.text,
                description: folderText.description,
                title: folderText.title,
                source: folderText.source    
            }
            
            let folderfile = await folderModel.findOneAndUpdate({_id:req.params.id},
                
               {

                $push:   {"folderholder.folderLink":folderlinkholder,
                        "folderholder.folderText":foldertextholder,
                        
                    }
                },
                {new : true}
            )
            console.log(foldertextholder)
            console.log(folderfile.folderholder.folderText)
            res.status(200).json(folderfile)
        }
    }
    catch(error){
        next(error)
    }
}) */



//delete request to delete a particular folder
router.delete('/:id',async(req,res,next)=>{
    try{
        const folderholder = await folderModel.findById(req.params.id)
        if(!folderholder){
            res.status(400)
            throw new Error('this link does not exist')
        }
        else{
            await folderholder.reomove()
            res.json({id:req.user.id})
        }

    }

    catch(error){
        next(error)
    }
})



//this creates the middleware that accesses all apis along the folder/links||images||texts path
router.use('/:id/links',redirect,require('../ROUTES/linkStore'))

router.use('/:id/images',redirect,require('../ROUTES/imageStore'))

router.use('/:id/texts',redirect,require('../ROUTES/textStore'))






module.exports = router