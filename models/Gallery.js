const mongoose = require('mongoose');

// Define the Gallery schema
const GallerySchema = new mongoose.Schema({
  images: [String], // Array to hold image file paths
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gallery', GallerySchema);
