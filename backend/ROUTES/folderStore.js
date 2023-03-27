const express = require('express')
const folderModel = require('../model/folderModel')
const router = express.Router()



router.get('/',async (req,res,next)=>{
    
    try{
    
        const folderdata = await folderModel.find({userid:req.user.id})
        
        if(folderdata[0]){
            res.status(200).json({folderdata:folderdata,state:true})
        }
        else{
            res.status(400).json({state:false,message:"no folders available!"})
        
        }
    }
    catch(error){
        next(error)
    }
})

router.post('/', async (req,res,next)=>{
    try{
        if(!req.body.name){
            res.status(400).json({state:'error',message:"fill-in name of folder"})
            
        }
        else{
          
            const name = req.body.name
          

            const folderfile = await folderModel.create({
                
                name:name,
                userid:req.user.id,
            })

            res.status(200).json({folderdata:folderfile,state:true})
        }
    }
    catch(error){
        next(error)
    }
})


//search through user folder
router.get('/search', async(req,res,next)=>{
 console.log(req.params.user)
    //console.log(`${req.query.message} value`)
    try{
        
        await folderModel.find({userid:req.user.id}).lean()
        
    
        const foundData = await folderModel.aggregate([
     
        {$match:
            {$text: 
                {$search: req.query.message,
                    $caseSensitive: false}} }
    
    ])       
    if(foundData[0]){
        res.json({state:true,folderdata:foundData})
    }
    else{
        res.json({state:false,message:'folder not available'})
}
}
    catch(error){
        next(error)
    }
}
)



//delete request to delete a particular folder
router.delete('/:id',async(req,res,next)=>{
    try{
            await folderModel.findByIdAndDelete(req.params.id)
            const folderdata = await folderModel.find({userid:req.user.id})
        
            if(folderdata[0]){
                res.status(200).json({folderdata:folderdata,state:true})
            }
            else{
                res.status(400).json({state:false,message:"no folders available!"})
        
            }
            

    }

    catch(error){
        next(error)
    }
})






module.exports = router