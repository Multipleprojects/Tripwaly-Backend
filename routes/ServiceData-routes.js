const express = require('express');
const router = express.Router();
const serviceDataController = require('../controller/ServiceData-controller');

// CRUD routes
router.post('/create', serviceDataController.createServiceData);
router.get('/get', serviceDataController.getServiceData);
// Route: update nested serviceData inside the serviceData array
router.put('/update/:id', serviceDataController.updateServiceData);
router.delete('/delete/:id', serviceDataController.deleteServiceData);

module.exports = router;
