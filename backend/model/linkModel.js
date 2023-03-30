const mongoose = require('mongoose')


const Link = mongoose.Schema({
    link:{
        type: String,
        required: true
        },
    description:{
        type:String,
        index: true
    },
    title:{
        type:String,
        required: true,
        index: true},
    source:{
        type:String,
        index: true
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


Link.index([{ title: 'text'},{ source: 'text'},{ description: 'text'}])

const linkObject = mongoose.model('link',Link)



module.exports = linkObject