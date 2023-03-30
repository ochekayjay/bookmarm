const mongoose = require('mongoose')


const Text = mongoose.Schema({
    text:{
        type:String,
        required:true,
        index: true},
        
    description:{
        type:String,
        required:true},
        
    title:{
        type:String,
        required:true,
        index: true},
        
    
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
        
    }
    ,
    folderid:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'folderModel',
        required: true,
    }
},
{
    timestamps :true
})

Text.index([{ title: 'text'},{ source: 'text'},{ text: 'text'}])

const textObject = mongoose.model('text',Text)

module.exports = textObject