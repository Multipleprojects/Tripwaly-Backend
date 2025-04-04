const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  active: { type: Boolean, default: true },
  verificationCode: {type:String, default:0},
  createddate: { type: Date, default: Date.now }
});
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
