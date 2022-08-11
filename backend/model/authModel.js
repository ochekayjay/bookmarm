const mongoose = require('mongoose')


const auth = mongoose.Schema({
    Username:{
        type: String,
        required: true,
    },
    Password:{
        type: String,
        required: true,
    },
    Email:{
        type: String,
        required: true,
        unique: true,
    }
},{
    timestamps :true
})

module.exports = mongoose.model('User',auth)