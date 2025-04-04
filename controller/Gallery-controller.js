const { Port } = require('../middleware/Port');
const Gallery = require('../models/Gallery');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
// Create a new gallery with multiple images
exports.createGallery = async (req, res) => {
  try {
    let images = [];

    if (req.files && req.files.images) {
      const uploadedImages = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const image of uploadedImages) {
        const timestamp = Date.now(); // Ensure timestamp is defined
        const uploadPath = path.join(__dirname, '..', 'tour-images', `${timestamp}-${image.name}`);

        // Move the file to the target directory
        await new Promise((resolve, reject) => {
          image.mv(uploadPath, (err) => {
            if (err) {
              console.error("Image upload error:", err);
              reject(new Error("Failed to upload image"));
            } else {
              images.push(`${Port}/${timestamp}-${image.name}`);
              resolve();
            }
          });
        });
      }
    }

    const newGallery = new Gallery({ images });
    await newGallery.save();
    res.status(201).json(newGallery);
  } catch (error) {
    console.error("Server error:", error); // Log the error for detailed insights
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get all galleries
exports.getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find();
    res.json(galleries);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get a specific gallery by ID
exports.getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: 'Gallery not found' });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


exports.updateGallery = async (req, res) => {
  const { id } = req.params;
  const { action, index } = req.body;

  try {
    // Find gallery by ID
    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery not found' });
    }

    const dirPath = path.resolve(__dirname, '../tour-images');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    if (action === 'add') {
      if (req.files && req.files.images) {
        const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
        const uploadedImages = [];
        const timestamp = Date.now();

        for (const file of files) {
          const filePath = path.join(dirPath, `${timestamp}-${file.name}`);
          try {
            await file.mv(filePath); // Move the file to the specified directory
            const uploadedUrl = `${req.protocol}://${req.get('host')}/tour-images/${timestamp}-${file.name}`;
            uploadedImages.push(uploadedUrl);
          } catch (error) {
            console.error('File upload error:', error.message);
            throw new Error('File upload failed.');
          }
        }

        gallery.images.push(...uploadedImages);
      } else {
        return res.status(400).json({ message: 'No images uploaded' });
      }
    } else if (action === 'delete') {
      if (index !== undefined && index >= 0 && index < gallery.images.length) {
        const removedImage = gallery.images.splice(index, 1)[0]; // Remove image from array
        const imagePath = path.join(__dirname, '../public', removedImage.replace(req.protocol + '://' + req.get('host'), ''));

        // Delete the file if it exists
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } else {
        return res.status(400).json({ message: 'Invalid index for deletion.' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid action specified.' });
    }

    // Save updated gallery
    await gallery.save();
    res.status(200).json({ message: 'Gallery updated successfully', gallery });

  } catch (err) {
    console.error('Error updating gallery:', err);
    res.status(500).json({ message: 'Error updating gallery', error: err.message });
  }
};


// Delete a gallery
exports.deleteGallery = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
