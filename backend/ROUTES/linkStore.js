const express = require('express')
const [ linkObject,textObject ] = require('../model/userStoreModel')
const protect = require('../middleware/authorizeUser')
const router = express.Router()
const folderModel = require('../model/folderModel')
const mongoose = require('mongoose')
const linkingid = mongoose.Types.ObjectId

/*router.get('/',protect, async (req,res,next)=>{
    try{
        const linkdata = await linkObject.find({userid:req.user.id})
        if(linkdata){
            res.status(200).json(linkdata)
        }
        else{
            res.status(400)
            throw new Error('Link does not exist')
        }
    }
    catch(error){
        next(error)
    }

})*/

const createLink = async(req,res,next)=>{
    const linkholder = await linkObject.findOne({userid:req.user.id})
    if(linkholder){

        req.linkId = linkholder._id
        console.log('found link id')
        console.log(req.linkId)
        next()
    }
    else{
        console.log(linkholder===null)
        console.log('not found')
        next()
    }
}


//query was passed in this api to help transfer folder api
router.post('/',createLink ,async (req,res,next)=>{
    try{
        if(!req.body.linkholder.link || !req.body.linkholder.description || !req.body.linkholder.title || !req.body.linkholder.source){
          
            res.status(400)
            throw new Error('kindly fill all fields')
           
        }
        else{

            const linkdata = await linkObject.findOne({_id:req.linkId})
            
            if(linkdata == null){
                
                const {link, description, title ,source} = req.body.linkholder
                const linkData =   await linkObject.create({
                    linkholder:{link,
                    description,
                    title,
                    source,
                    },
                    userid: req.user.id
                })
                
                console.log(linkData)
                const linkparam = linkingid(linkData._id)
                const linkContainer = await folderModel.findByIdAndUpdate(req.query?.folder,{linkId:linkparam},{new:true}).populate('linkId')
                console.log('trying in linkstore')
                console.log(linkContainer)
                res.json({linkData:linkData,success:true})
                //res.json({linkContainer:linkContainer,success:true})
            }

            else{
                const {link, description ,title ,source} = req.body.linkholder
           const holder = {link,description,title,source}
           
            const updatedLink = await linkObject.findOneAndUpdate({_id:req.linkId},
                {

                    $push:   {"linkholder":holder,
                        }
                    },
                    {new : true})
        
            
            const linkparam = linkingid(updatedLink._id)
            const linkContainer = await folderModel.findByIdAndUpdate(req.query?.folder,{linkId:linkparam},{new:true}).populate('linkId')
            //res.json({updatedLink:updatedLink,success:true})
            res.json({linkContainer:linkContainer,success:true})
            }
            
        }
    }
    catch(error){
        next(error)
    }

})

/*router.get('/:id', async(req,res,next)=>{
    try{
    const linkFolder = await linkObject.findById(req.params.id);
    if(!linkFolder){
        res.status(400).send('this folder does not exist')
    }
    else{
        res.status(200).json({linkFolder:linkFolder,success:true})
    }
    }

    catch(error){
        next(error)
    }
    
})*/






/*router.put('/',createLink,async(req,res,next)=>{
    try{
        const linkdata = await folderModel.findOne({_id:req.idholder})
        if(!linkdata){
            res.status(400)
            throw new Error('this folder does not exist')
        }
        else{
           const {link, description ,title ,source} = req.body.linkholder
           const holder = {link,description,title,source}
           
            const updatedLink = await linkObject.findOneAndUpdate({_id:req.linkId},
                {

                    $push:   {"linkholder":holder,
                        }
                    },
                    {new : true})
        
            res.json({updatedLink:updatedLink,success:true})
            
        }
    }
    catch(error){
        next(error)
    }

})*/

router.delete('/:id',protect,async(req,res,next)=>{
    try{
        const linkdata = await linkObject.find()
        console.log(linkdata)
        if(!linkdata){
            res.status(400)
            throw new Error('this link does not exist')
        }
        else{
           const linkUpdated =  await linkObject.updateOne({userid:req.user.id},{
                $pull:{linkholder:{_id:req.params.id}}
            })
            res.json({linkUpdated:linkUpdated,success:true})
        }
    }
    catch(error){
        next(error)
    }
})

module.exports = router