// models/Company.js
const mongoose = require('mongoose');
const CompanySchema = new mongoose.Schema({
  name: { type: String },
  companyName: { type: String },
  email: { type: String },
  password: { type: String },
  phoneNumber: { type: String },
  companyAddress: { type: String },
  verificationCode: {type:String, default:0},
  description: { type: String },
  active: { type: Boolean, default: false },
  role: { type: String, default: 'company' },
  companyimage: String,
  countcompanyrating:{ type:Number, default:0 },
  counttour:{ type:Number, default:0 },
  createddate: { type: Date, default: Date.now }, // Added createddate field
}, { timestamps: true });
module.exports = mongoose.model('Company', CompanySchema);
