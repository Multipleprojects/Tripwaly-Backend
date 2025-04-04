const express = require('express');
const router = express.Router();
const reviewController = require('../controller/Review-controller'); // Corrected path
// Route to create a new review (with image upload)
router.post('/create', reviewController.createReview);
// Route to get all reviews
router.get('/get',reviewController.getAllReviews);
// Route to get a review by ID
router.get('/getbyid/:id',reviewController.getReviewById);
// Route to update a review by ID (wit image upload)
router.put('/update/:id', reviewController.updateReview);
// Route to delete a review by ID
router.delete('/delete/:id',reviewController.deleteReview);
module.exports = router;
