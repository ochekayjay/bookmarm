const mongoose = require('mongoose')


const Link = mongoose.Schema({
    link:{
        type: String,
        required: true
        },
    description:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required: true},
    source:{
        type:String,
        },
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    folderid:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'folderModel',
        required: true,
    }
},
{
    timestamps :true
})


const linkObject = mongoose.model('link',Link)



module.exports = linkObject