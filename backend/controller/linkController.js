

const linkModel = require('../model/linkModel')



const getAllLinks = async(req,res,next)=>{
    const allLinks = await linkModel.find({userid:req.user.id})
    if(allLinks[0]){
        res.json({linkdata:allLinks,state:true})
    }
    else{
        res.json({state:false,message:'No Link Data available!'})
    }
    
}

const getFolderLinks = async(req,res,next)=>{
    const folderLinks = await linkModel.find({folderid:req.params.folderId})
    if(folderLinks[0]){
        res.json({linkdata:folderLinks,state:true})
    }
    else{
        res.json({state:false,message:'No link Data Available'})
    }
    
}

const getOneLink = async(req,res,next)=>{
    const linkObj = await linkModel.findById(req.params.linkid)

    res.json(linkObj)
}

const createLink = async(req,res,next)=>{

    try{
    if(!req.body.link || !req.body.description || !req.body.title){
        res.json({status:'error',message : 'fill-in all neccessary details.'})
    }
    else {
const linkObj =  await linkModel.create({
            link : req.body.link,
            description: req.body.description,
            title: req.body.title,
            source: req.body.source,
            userid : req.user.id,
            folderid : req.headers.folderid
    })

    res.json({linkdata:linkObj,state:true})
}
}

catch(error){
    next(error)
}
}


const deleteLink = async(req,res,next)=>{
    await linkModel.findByIdAndDelete(req.params.delid)

    const folderLinks = await linkModel.find({folderid:req.headers.folderid})

    if(folderLinks[0]){
        res.json({linkdata:folderLinks,state:true})
    }
    else{
        res.json({state:false,message:'no link Data available.'})
    }
    

}

//link search


const querySearchLink = async(req,res,next)=>{
    console.log(req.params.user)
       //console.log(`${req.query.message} value`)
       try{
           
           await linkModel.find({userid:req.user.id}).lean()
           
       
           const foundData = await linkModel.aggregate([
        
           {$match:
               {$text: 
                   {$search: req.query.message,
                       $caseSensitive: false}} }
       
       ])       
       if(foundData[0]){
        res.json({state:true,linkdata:foundData})
           
       }
       else{
        res.json({state:false,message:"link not found!"}) 
   }
   }
       catch(error){
           next(error)
       }
   }



module.exports = {getAllLinks,getFolderLinks,getOneLink,createLink,deleteLink,querySearchLink}