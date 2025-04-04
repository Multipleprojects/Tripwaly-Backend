const express = require('express');
const router = express.Router();
const {
    createFAQS,
    getAllFAQS,
    getFAQSByTour,
    updateFAQS,
    deleteFAQS
} = require('../controller/FAQS-controller');

// POST: Create new FAQs
router.post('/create', createFAQS);

// GET: Get all FAQs
router.get('/get', getAllFAQS);

// GET: Get FAQs by tour ID
router.get('/:tourId', getFAQSByTour);

// PUT: Update FAQs by ID
router.put('/update/:id', updateFAQS);

// DELETE: Delete FAQs by ID
router.delete('/delete/:id', deleteFAQS);

module.exports = router;
