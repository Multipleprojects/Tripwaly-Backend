// controllers/reviewController.js
const Review = require('../models/Review');
const Tour = require('../models/Tour');
const User = require('../models/User');
const Company = require('../models/Company');
const path = require('path');
const { Port } = require('../middleware/Port');

exports.createReview = async (req, res) => {
    try {
        const { user, tour, review, rating } = req.body;

        // Validate required fields
        if (!user || !tour || !review || !rating) {
            return res.status(400).json({ message: 'All fields are required' });
        }
 const existUser=await Review.findOne({user});
    const existTour=await Review.findOne({tour})
    if(existUser && existTour)
    {
      return res.status(404).json({ message: 'Review already created' });
    }

        // Validate rating value
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check if the user and tour exist
        const existingUser = await User.findById(user);
        const existingTour = await Tour.findById(tour);

        if (!existingUser || !existingTour) {
            return res.status(404).json({ message: 'User or Tour not found please login again' });
        }

        // Handle image upload
        let uploadedImagePath = null;
        if (req.files && req.files.images) {
            const image = req.files.images;
            const timestamp = Date.now();
            const uploadPath = path.join(__dirname, '..', 'tour-images', `/${timestamp}-${image.name}`);
            await new Promise((resolve, reject) => {
                image.mv(uploadPath, (err) => {
                    if (err) {
                        console.error('Image upload error:', err);
                        reject(new Error('Failed to upload image'));
                    } else {
                        uploadedImagePath = `${Port}/${timestamp}-${image.name}`;
                        resolve();
                    }
                });
            });
        }

        // Create a new review
        const newReview = new Review({
            user,
            tour,
            review,
            rating,
            images: uploadedImagePath,
        });

        // Save the review to the database
        await newReview.save();
        // Update Tour ratings
        existingTour.ratingcount=existingTour.ratingcount + newReview.rating;
        existingTour.ratingmembers += 1;
        await existingTour.save();

        // Update Company ratings
        const companyId = existingTour.company; // Get the company ID from the tour
        if (companyId) {
            const existingCompany = await Company.findById(companyId);
            if (existingCompany) {
                existingCompany.countcompanyrating =existingCompany.countcompanyrating + newReview.rating;
                await existingCompany.save();
            }
        }

        res.status(201).json({ message: 'Review created successfully', newReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name email') // Populate the user details
            .populate('tour').populate({
                path: 'tour', // Populate the tour field in the Booking schema
                populate: {
                  path: 'company', // Populate tourid within the tour reference
                  model: 'Company' // Specify the model if required
                }
              });

            res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// GET method to retrieve a single review by ID
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('user', 'name email')
            .populate('tour', 'title city');

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// PUT method to update an existing review by ID
exports.updateReview = async (req, res) => {
    try {
        const { publish } = req.body; 
        const existingReview = await Review.findById(req.params.id);

        if (!existingReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Update the review
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { publish }, // Update the necessary fields
            { new: true } // Return the updated document
        );

        res.status(200).json({
            message: 'Review updated successfully',
            review: updatedReview,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
};

// DELETE method to remove a review by ID
exports.deleteReview = async (req, res) => {
    try {
    await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
