// controllers/achievementsController.js
const { Port } = require('../middleware/Port');
const achievements = require('../models/Achievements');
const fs = require('fs');
const path=require('path')
// Create a new achievements
exports.createachievements = async (req, res) => {
  try {
    const { message, successfulTrips, regularClients, yearsExperience } = req.body;

    // Check if the image is uploaded
    let imgUrl = '';
    if (req.files && req.files.img) {
      const img = req.files.img;
      
      // Define the path to save the image
      const uploadDir = path.join(__dirname, '../tour-images'); // Define the folder path

      // Check if the directory exists, and create it if not
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Construct the full path for saving the image
      const imgPath = path.join(uploadDir, img.name);
      
      // Move the image to the defined directory
      await img.mv(imgPath);

      // Store the image URL
      imgUrl = `${Port}/${img.name}`;
    }

    // Create a new achievement record
    const newAchievement = new achievements({
      message,
      successfulTrips,
      regularClients,
      yearsExperience,
      img: imgUrl, // Save the image URL in the database
    });

    // Save the new achievement in the database
    await newAchievement.save();

    res.status(201).json(newAchievement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all achievements
exports.getachievements = async (req, res) => {
  try {
    const Achievements = await achievements.find();
    res.status(200).json(Achievements);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single achievements by ID
exports.getachievementsById = async (req, res) => {
  try {
    const achievements = await achievements.findById(req.params.id);
    if (!achievements) {
      return res.status(404).json({ error: 'achievements not found' });
    }
    res.status(200).json(achievements);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateachievements = async (req, res) => {
  try {
    const { message, successfulTrips, regularClients, yearsExperience } = req.body;

    // Check if the achievement exists
    const existingAchievement = await achievements.findById(req.params.id);
    if (!existingAchievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    // Handle image upload if provided
    let imgUrl = existingAchievement.img; // Retain existing image URL if no new image is uploaded

    if (req.files && req.files.img) {
      const img = req.files.img;
      
      // Define the path to save the image
      const uploadDir = path.join(__dirname, '../tour-images'); // Define the folder path

      // Check if the directory exists, and create it if not
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Construct the full path for saving the image
      const imgPath = path.join(uploadDir, img.name);
      
      // Move the image to the defined directory
      await img.mv(imgPath);

      // Update the image URL
      imgUrl = `${Port}/${img.name}`;
    }

    // Update achievement with new data
    const updatedAchievement = await achievements.findByIdAndUpdate(
      req.params.id,
      {
        message,
        successfulTrips,
        regularClients,
        yearsExperience,
        img: imgUrl, // Update the image field as well
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Achievement updated successfully', updatedAchievement });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Delete a achievements
exports.deleteachievements = async (req, res) => {
  try {
    const achievements = await achievements.findByIdAndDelete(req.params.id);
    if (!achievements) {
      return res.status(404).json({ error: 'achievements not found' });
    }
    res.status(200).json({ message: 'achievements deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
