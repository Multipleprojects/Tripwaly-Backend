const mongoose = require('mongoose');

const BookingStatusSchema = new mongoose.Schema({
    userid: String, 
    tourid: String,
});

const BookingStatus = mongoose.model('BookingStatus', BookingStatusSchema);

module.exports = BookingStatus;
