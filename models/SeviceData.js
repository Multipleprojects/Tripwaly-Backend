const mongoose = require('mongoose');

const serviceDataSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String }
}, { timestamps: true });

const ServiceData = mongoose.model('ServiceData', serviceDataSchema);
module.exports = ServiceData;
