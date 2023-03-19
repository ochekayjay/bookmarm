

const linkModel = require('../model/linkModel')



const getAllLinks = async(req,res,next)=>{
    const allLinks = await linkModel.find({userid:req.user.id})

    res.json({allLinks,success:true})
}

const getFolderLinks = async(req,res,next)=>{
    const folderLinks = await linkModel.find({folderid:req.params.folderId})

    res.json({folderLinks,success:true})
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

    res.json(linkObj)
}
}

catch(error){
    next(error)
}
}


const deleteLink = async(req,res,next)=>{
    await linkModel.findByIdAndDelete(req.params.delid)

    const folderLinks = await linkModel.find({folderid:req.headers.folderid})

    res.json({folderLinks,success:true})

}

//link search
const querySearchLink = async(req,res,next)=>{
    try{
    const foundData = await linkModel.aggregate([
        {$match:{
            $and : [
                {userid:
                    req.user.id},
                {$text: 
            {$search: req.query.message,
                $caseSensitive: false}
        }]}},{
            $sort:{
                count:{$meta:"textScore"},
                _id: -1
            }
        }])
    if(!foundData){
        res.json({message:"link not found!"})
    }
    else{
res.json(foundData)
}
}
    catch(error){
        next(error)
    }
}



module.exports = {getAllLinks,getFolderLinks,getOneLink,createLink,deleteLink,querySearchLink}