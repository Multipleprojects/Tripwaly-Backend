const FAQSmodel = require('../models/FAQS');
const Tourid= require('../models/Tour')
// Create new FAQs
const createFAQS = async (req, res) => {
    try {
        const { tour, TourFAQS } = req.body;

        const TourId = await Tourid.findById(tour); // This should find the Tour by its ID
        if (!TourId) {
            res.status(400).json("Tour Id not defined or correct");
            return;
        }
        const newFAQS = new FAQSmodel({
            tour,
            TourFAQS
        });
        await newFAQS.save();
        res.status(201).json("Tour FAQS created successfully");
    } catch (error) {
        console.error('Error stack:', error.stack); // Add detailed error logging
        res.status(500).json({ error: error.message });
    }
};

// Get all FAQs
const getAllFAQS = async (req, res) => {
    try {
        const faqs = await FAQSmodel.find().populate('tour');
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get FAQs by tour ID
const getFAQSByTour = async (req, res) => {
    try {
        const { tourId } = req.params;
        const faqs = await FAQSmodel.find({ tour: tourId }).populate('tour');
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update FAQs
const updateFAQS = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFAQS = await FAQSmodel.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedFAQS);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete FAQs
const deleteFAQS = async (req, res) => {
    try {
        const { id } = req.params;
        await FAQSmodel.findByIdAndDelete(id);
        res.status(200).json({ message: 'FAQs deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createFAQS,
    getAllFAQS,
    getFAQSByTour,
    updateFAQS,
    deleteFAQS
};
