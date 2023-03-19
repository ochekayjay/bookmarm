const mongoose = require("mongoose");

// Creating a Schema for uploaded files
const fileSchema = new mongoose.Schema({
  image: Buffer,
  imageType: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  nameofimage:{
    type:String,
    required:true,
    index: true
  },
  title:{
    type:String,
    required:true,
    index: true},
  
  source:{
    type:String,
    index: true},
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

fileSchema.index([{ title: 'text'},{ source: 'text'},{ nameofimage: 'text'}])

// Creating a Model from that Schema
const imageModel = mongoose.model("img", fileSchema);

// Exporting the Model to use it in app.js File.
module.exports = imageModel;