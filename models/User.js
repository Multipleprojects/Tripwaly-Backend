// models/User.js
const mongoose = require('mongoose');
const Userschema = new mongoose.Schema({
    name: String,
    email:  String ,
    password:String ,
    phone: String ,
  verificationCode: {type:String, default:0},
    userimage: {type:String, default:null},
    active: { type: Boolean, default: true },
    createddate: { type: Date, default: Date.now },

  },
   { timestamps: true });
module.exports = mongoose.model('User', Userschema);
