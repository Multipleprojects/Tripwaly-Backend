// models/User.js
const mongoose = require('mongoose');
const Categoryschema = new mongoose.Schema({
    name: String,
    image: {type:String, default:null},
  },
   { timestamps: true });
module.exports = mongoose.model('Category', Categoryschema);
