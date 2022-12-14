const mongoose = require("mongoose");

// Creating a Schema for uploaded files
const fileSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  imageFolder: [{nameofimage:String,title:String,source:String}],
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