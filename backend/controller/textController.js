
const textModel = require('../model/textModel')



const getAlltexts = async(req,res,next)=>{
    const allTexts = await textModel.find({userid:req.user.id})

    if(allTexts[0]){
        res.json({textdata:allTexts,state:true})
    }
    else{
        res.json({state:false,message:'No Text Data available!'})
    }
    
}

const getFolderTexts = async(req,res,next)=>{
    const textdata = await textModel.find({folderid:req.params.folderId})

    if(textdata[0]){
        res.json({textdata,state:true})
    }
    else{
        res.json({state:false,message:'No Text Data available!'})
    }
    
}

const getOneText = async(req,res,next)=>{
    const textObj = await textModel.findById(req.params.textid)

    res.json(textObj)
}

const createText = async(req,res,next)=>{

    try{
    if(!req.body.text || !req.body.description || !req.body.title){
        res.json({status:"error",message : 'fill-in all neccessary details.'})
    }
    else {
const textdata =  await textModel.create({
            text : req.body.text,
            description: req.body.description,
            title: req.body.title,
            source: req.body.source,
            userid : req.user.id,
            folderid : req.headers.folder
    })

    res.json({textdata,state:true})
}
}

catch(error){
    next(error)
}
}


//search text

const querySearchText = async(req,res,next)=>{
    console.log(req.params.user)
       //console.log(`${req.query.message} value`)
       try{
           
           await textModel.find({userid:req.user.id}).lean()
           
       
           const foundData = await textModel.aggregate([
        
           {$match:
               {$text: 
                   {$search: req.query.message,
                       $caseSensitive: false}} }
       
       ])       
       if(!foundData[0]){
        res.json({textdata:foundData,state:true})
           
       }
       else{
        res.json({state:false,message:"text not found!"})
   
   }
   }
       catch(error){
           next(error)
       }
   }


const deleteText = async(req,res,next)=>{
    await textModel.findByIdAndDelete(req.params.delid)

    const folderTexts = await textModel.find({folderid:req.headers.folderid})
    if(folderTexts[0]){
        res.json({textdata:folderTexts,state:true})
    }
    else{
        res.json({state:false,message:'empty text collection'})
    }
    
}


module.exports = {getAlltexts,getFolderTexts,getOneText,createText,deleteText,querySearchText}