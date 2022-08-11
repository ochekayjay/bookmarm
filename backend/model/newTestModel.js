const mongoose = require("mongoose");

// Creating a Schema for uploaded files
const newTestSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  imageFolder: [{nameofimage:String,title:String,source:String}],

});

// Creating a Model from that Schema
const imageModelTest = mongoose.model("imgTest", newTestSchema);

// Exporting the Model to use it in app.js File.
module.exports = imageModelTest;