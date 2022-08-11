const mongoose = require('mongoose')
const [linkObject] = require('./userStoreModel') 


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
        required: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps :true
})

module.exports = mongoose.model('folderModel',folder)