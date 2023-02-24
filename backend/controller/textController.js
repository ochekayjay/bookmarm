
const textModel = require('../model/textModel')



const getAlltexts = async(req,res,next)=>{
    const allTexts = await textModel.find({userid:req.user.id})

    res.json({allTexts,success:true})
}

const getFolderTexts = async(req,res,next)=>{
    const folderTexts = await textModel.find({folderid:req.params.folderId})

    res.json({folderTexts,success:true})
}

const getOneText = async(req,res,next)=>{
    const textObj = await textModel.findById(req.params.textid)

    res.json(textObj)
}

const createText = async(req,res,next)=>{

    try{
    if(!req.body.text || !req.body.description || !req.body.title){
        res.json({message : 'fill-in all neccessary details.'})
    }
    else {
const textObj =  await textModel.create({
            text : req.body.text,
            description: req.body.description,
            title: req.body.title,
            source: req.body.source,
            userid : req.user.id,
            folderid : req.headers.folder
    })

    res.json(textObj)
}
}

catch(error){
    next(error)
}
}


const deleteText = async(req,res,next)=>{
    await textModel.findByIdAndDelete(req.params.delid)

    res.json({message:'succesfully deleted'})
}


module.exports = {getAlltexts,getFolderTexts,getOneText,createText,deleteText}