const express = require('express')
const folderModel = require('../model/folderModel')
const router = express.Router()



router.get('/',async (req,res,next)=>{
    try{
        const folderdata = await folderModel.find({userid:req.user.id})
        if(folderdata){
            res.status(200).json({folderdata:folderdata,success:true})
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
            })

            res.status(200).json({folderfile:folderfile,success:true})
        }
    }
    catch(error){
        next(error)
    }
})





//delete request to delete a particular folder
router.delete('/:id',async(req,res,next)=>{
    try{
        const folderholder = await folderModel.findById(req.params.id)
        if(!folderholder){
            res.status(400)
            throw new Error('this link does not exist')
        }
        else{
            await folderholder.remove()
            res.json({id:req.user.id,success:true})
        }

    }

    catch(error){
        next(error)
    }
})






module.exports = router