const mongoose = require('mongoose');
const tourcitySchema= new mongoose.Schema({
  citytour: [{
    cityname:String,
image: { type:[String], default:null },
tourcount:{ type:Number, default:0 }
  }],
});
const Tourcity = mongoose.model('city', tourcitySchema);
module.exports = Tourcity;
