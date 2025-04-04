
const Tourcitycontroller = require('../controller/Cities-controller');
const express = require('express');

const router = express.Router();

router.post('/create', Tourcitycontroller.createTourCity);
router.post('/create/:id', Tourcitycontroller.addCityToTour);
router.get('/get', Tourcitycontroller.getTourCities);
router.put('/updatebyindex/:id', Tourcitycontroller.updateCityByIndex);
router.delete('/deletebyindex/:id', Tourcitycontroller.deleteCityByIndex);
router.delete('/delete/:id', Tourcitycontroller.deleteTourcity);
router.get('/filter/get', Tourcitycontroller.getFilteredTourCities);


module.exports = router;