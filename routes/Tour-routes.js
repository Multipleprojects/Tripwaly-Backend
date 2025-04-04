const express = require('express');
const router = express.Router();
const tourController = require('../controller/Tour-controller');

router.post('/create', tourController.createTour);
router.put('/update/:id',tourController.updateTour);
router.delete('/delete/:id', tourController.deleteTour);
router.get('/get', tourController.getAllTours);
router.get('/get/:id', tourController.getToursByID);

router.get('/get/tourcity', tourController.getTourCity);


module.exports = router;
