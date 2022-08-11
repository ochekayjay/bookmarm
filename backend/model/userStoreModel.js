const mongoose = require('mongoose')


const Link = mongoose.Schema({
    linkholder: [{link:String,description:String,title:String,source:String}],
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{
    timestamps :true
})


const linkObject = mongoose.model('link',Link)

const Text = mongoose.Schema({
    textholder: [{text:String,description:String,title:String,source:String}],
    
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
        
    }
},
{
    timestamps :true
})


const textObject = mongoose.model('text',Text)

module.exports = [linkObject,textObject]