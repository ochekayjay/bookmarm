const mongoose = require("mongoose");

// Creating a Schema for uploaded files
const fileSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
 path:{
  type:String,
  required:true
 },
  nameofimage:{
    type:String,
    required:true
  },
  title:{
    type:String,
    required:true},
  
  source:{
    type:String},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
folder:{
  type:mongoose.Schema.Types.ObjectId,
  ref: 'folderModel',
  required: true
}
});

// Creating a Model from that Schema
const imageModel = mongoose.model("img", fileSchema);

// Exporting the Model to use it in app.js File.
module.exports = imageModel;