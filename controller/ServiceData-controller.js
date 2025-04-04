const fs = require('fs');
const path = require('path');
const ServiceData = require('../models/SeviceData');
const { Port } = require('../middleware/Port');

exports.createServiceData = async (req, res) => {
    try {
        let imagePath = '';

        // Check if an image file is uploaded
        if (req.files && req.files.image) {
            let imageFile = req.files.image;
            let imageName = Date.now() + path.extname(imageFile.name);
            let uploadDir = path.join(__dirname, '../tour-images');

            // Ensure the uploads folder exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            let absolutePath = path.join(uploadDir, imageName); // Save the file
            let dbPath = `${Port}/` + imageName; // Store relative path in DB

            await imageFile.mv(absolutePath);
            imagePath = dbPath;
        }

        // Create a new separate serviceData document
        const newServiceData = await ServiceData.create({
            title: req.body.title,
            description: req.body.description,
            image: imagePath
        });

        res.status(201).json(newServiceData);
    } catch (error) {
        console.error("Error creating service data:", error);
        res.status(400).json({ error: error.message });
    }
};


exports.getServiceData = async (req, res) => {
    try {
        const serviceDataList = await ServiceData.find();
        res.status(200).json(serviceDataList);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateServiceData = async (req, res) => {
    const { id } = req.params;
    let imagePath = '';

    try {
        // Handle image upload if a new image is provided
        if (req.files && req.files.image) {
            let imageFile = req.files.image;
            let imageName = Date.now() + path.extname(imageFile.name);
            let uploadDir = path.join(__dirname, '../tour-images');

            // Ensure the uploads folder exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            let absolutePath = path.join(uploadDir, imageName);
            let dbPath = `${Port}/` + imageName;

            await imageFile.mv(absolutePath);
            imagePath = dbPath;
        }

        // Prepare the update object
        let updateFields = {};
        if (req.body.title) updateFields.title = req.body.title;
        if (req.body.description) updateFields.description = req.body.description;
        if (imagePath) updateFields.image = imagePath;

        // Update the document
        const updatedServiceData = await ServiceData.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedServiceData) {
            return res.status(404).json({ message: 'Service data not found' });
        }

        res.status(200).json(updatedServiceData);
    } catch (error) {
        console.error('Error updating service data:', error.message);
        res.status(400).json({ error: error.message });
    }
};


exports.deleteServiceData = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedServiceData = await ServiceData.findByIdAndDelete(id);
        if (!deletedServiceData) {
            return res.status(404).json({ message: 'Service data not found' });
        }
        res.status(200).json({ message: 'Service data deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
