// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controller/Booking-controller');
const auth = require('../middleware/authuser'); // Import the auth middleware
// Route to create a new booking - Protected
router.post('/create',bookingController.createBooking);
// Route to get all bookings - Protected
router.get('/get', bookingController.getAllBookings);
// Route to update a booking by ID - Protected
router.get('/getbookingstatus', bookingController.getBookingStatus);

router.put('/update/:id', bookingController.updateBooking);
// Route to delete a booking by ID - Protected
router.delete('/delete/:id', bookingController.deleteBooking);

module.exports = router;
