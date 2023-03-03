

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
        res.json({message : 'fill-in all neccessary details.'})
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

    res.json({message:'succesfully deleted'})
}


module.exports = {getAllLinks,getFolderLinks,getOneLink,createLink,deleteLink}