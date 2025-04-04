const mongoose = require('mongoose');

const Metadatachema = new mongoose.Schema({
   title:String,
    description: {
        type: String,
        required: true,
    },
    img1: { type: String, required: true },
    img2: { type: String, required: true },
    video1: { type: String, required: true },
}, { timestamps: true });

const Metadata = mongoose.model('Metadata', Metadatachema);

module.exports = Metadata;
