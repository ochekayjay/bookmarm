const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    projectTitle:{
        type: String
    },
    avatarName:{
        type: String
    },
    userinfo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{
    timestamps :true
})

module.exports = mongoose.model('Userbio',userSchema)