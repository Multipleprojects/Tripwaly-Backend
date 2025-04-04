const express = require('express');
const router = express.Router();
const subscriptionController = require('../controller/Subscription-controller'); // Adjust path as necessary


// Route to create a new subscription
router.post('/create', subscriptionController.createSubscription);

// Route to get all subscriptions
router.get('/get', subscriptionController.getSubscriptions);

// Route to get a subscription by ID
router.get('/getbyid/:id', subscriptionController.getSubscriptionById);

// Route to update a subscription by ID
router.put('/update/:id', subscriptionController.updateSubscription);

// Route to delete a subscription by ID
router.delete('/delete/:id', subscriptionController.deleteSubscription);

module.exports = router;
