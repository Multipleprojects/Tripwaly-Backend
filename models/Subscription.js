const mongoose = require('mongoose');
const { unsubscribe } = require('../routes/Admin-routes');
const subscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  unsubscribe:{type:Boolean, default:false}
});
const subscription = mongoose.model('subscription', subscriptionSchema);

module.exports = subscription;
