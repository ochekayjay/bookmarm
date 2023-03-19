const mongoose = require('mongoose')

const folder = mongoose.Schema({
    
    linkId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'link'
    },

    textId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'text'
    },

    imageId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'img'
    },
    name:{
        type:String,
        required: true,
        index: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps :true
})

folder.index({ name: 'text'})

module.exports = mongoose.model('folderModel',folder)