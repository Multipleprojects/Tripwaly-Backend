const { Port } = require('../middleware/Port');
const Metadata = require('../models/Metadata')
const fs = require("fs");
const path = require("path");

exports.createMetadata = async (req, res) => {
  try {
    const { description, title } = req.body;

    // Ensure files are uploaded
    if (!req.files || !req.files.img1 || !req.files.img2 || !req.files.video1) {
      return res.status(400).json({ message: "All files (img1, img2, video1) are required" });
    }

    // Directory where files will be saved
    const parentDir = path.join(__dirname, "../tour-images");

    // Ensure the directory exists
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    // Save files to the parent directory
    const img1 = req.files.img1;
    const img2 = req.files.img2;
    const video1 = req.files.video1;

    const img1Path = `${parentDir}/${img1.name}`;
    const img2Path = `${parentDir}/${img2.name}`;
    const video1Path = `${parentDir}/${video1.name}`;

    await img1.mv(img1Path);
    await img2.mv(img2Path);
    await video1.mv(video1Path);

    // Construct URLs using the Port value
    const img1Url = `${Port}/${img1.name}`;
    const img2Url = `${Port}/${img2.name}`;
    const video1Url = `${Port}/${video1.name}`;

    // Create new metadata object
    const newMetadata = new Metadata({
      title,
      description,
      img1: img1Url,
      img2: img2Url,
      video1: video1Url,
    });

    // Save metadata to the database
    await newMetadata.save();

    res.status(201).json({ message: "Metadata created successfully", newMetadata });
  } catch (error) {
    res.status(400).json({ message: "Error creating Metadata", error: error.message });
  }
};

// Get all Metadata
exports.getAllMetadata = async (req, res) => {
    try {
        const metadata = await Metadata.find();
        res.status(200).json(metadata);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving Metadata', error });
    }
};

// Get Metadata by ID
exports.getMetadataById = async (req, res) => {
    try {
        const Metadata = await Metadata.findById(req.params.id);
        if (!Metadata) {
            return res.status(404).json({ message: 'Metadata not found' });
        }
        res.status(200).json(Metadata);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving Metadata', error });
    }
};

exports.updateMetadata = async (req, res) => {
    try {
      const { description } = req.body;
  
      // Find existing metadata
      const existingMetadata = await Metadata.findById(req.params.id);
      if (!existingMetadata) {
        return res.status(404).json({ message: "Metadata not found" });
      }
  
      // Handle file uploads
      const parentDir = path.join(__dirname, "../tour-images");
  
      let img1Url = existingMetadata.img1;
      let img2Url = existingMetadata.img2;
      let video1Url = existingMetadata.video1;
  
      if (req.files) {
        if (req.files.img1) {
          const img1 = req.files.img1;
          const img1Path = `${parentDir}/${img1.name}`;
          await img1.mv(img1Path);
          img1Url = `${Port}/${img1.name}`;
        }
        if (req.files.img2) {
          const img2 = req.files.img2;
          const img2Path = `${parentDir}/${img2.name}`;
          await img2.mv(img2Path);
          img2Url = `${Port}/${img2.name}`;
        }
        if (req.files.video1) {
          const video1 = req.files.video1;
          const video1Path = `${parentDir}/${video1.name}`;
          await video1.mv(video1Path);
          video1Url = `${Port}/${video1.name}`;
        }
      }
  
      // Update metadata in the database
      const updatedMetadata = await Metadata.findByIdAndUpdate(
        req.params.id,
        {
          description,
          img1: img1Url,
          img2: img2Url,
          video1: video1Url,
        },
        { new: true, runValidators: true }
      );
  
      res.status(200).json({ message: "Metadata updated successfully", updatedMetadata });
    } catch (error) {
      res.status(400).json({ message: "Error updating Metadata", error: error.message });
    }
  };
  


// Delete Metadata by ID
exports.deleteMetadata = async (req, res) => {
    try {
        const Metadata = await Metadata.findByIdAndDelete(req.params.id);
        if (!Metadata) {
            return res.status(404).json({ message: 'Metadata not found' });
        }
        res.status(200).json({ message: 'Metadata deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting Metadata', error });
    }
};
