// controllers/bookingController.js
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const User = require('../models/User');
const BookingStatus = require('../models/BookingStatus');

exports.createBooking = async (req, res) => {
  try {
    const {
      user,
      tour,
      totalCharges,
      number,
      fullname,
      kid,
      elder,
    } = req.body;

    const existUser=await Booking.findOne({user});
    const existTour=await Booking.findOne({tour})
    if(existUser && existTour)
    {
      return res.status(400).json({ message: 'Booking is already created' });
    }
    // Validate required fields
    if (!user || !tour) {
      return res
        .status(400)
        .json({ message: 'Something missing. Please log in again.' });
    }
    
    // Check if the user, tour, and tour seats exist
    const existingUser = await User.findById(user);
    const existingTour = await Tour.findById(tour);
    const existingTourSeats = await Tour.findById(tour);

    if (!existingTour || !existingTourSeats || !existingUser) {
      let message = '';
      if (!existingUser) {
        message =
          'The user account could not be found. Please log in or register.';
      } else if (!existingTour) {
        message =
          'The selected tour is no longer available. Please choose another tour.';
      } else if (!existingTourSeats) {
        message =
          'Seats for this tour are not available. Please try a different tour or date.';
      }
      return res.status(404).json({ message });
    }

    const numOfPersons = elder;

    // Check if enough available seats
    if (existingTourSeats.availableseats <= numOfPersons) {
      return res.status(400).json({ message: 'Not enough available seats for this tour.' });
    }
    // Update available seats
    existingTourSeats.availableseats -= numOfPersons;
    await existingTourSeats.save();
    // Create a new booking
    const newBooking = new Booking({
      user,
      tour,
      numOfPersons,
      totalCharges,
      approved: false, 
      number,
      fullname,
      kid,
      elder,
    });
    await newBooking.save();

    // Check if a BookingStatus entry already exists
    const existingBookingStatus = await BookingStatus.findOne({
      userid: user,
      tourid: tour,
    });

    if (!existingBookingStatus) {
      // If not, create a new BookingStatus entry
      const newBookingStatus = new BookingStatus({
        userid: user,
        tourid: tour,
      });
      await newBookingStatus.save();
    }

    // Respond with success message and updated seat count
    res.status(201).json({
      message: 'Booking Created Successfully',
    });
  } catch (error) {
    console.error('Booking Error: ', error); // Log the error for debugging
    res.status(500).json({ message: 'Server error', error });
  }
};

  //get all booking
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
        .populate('user', 'name email') // Populate user with name and email
  .populate({
    path: 'tour', 
  }).populate({
    path: 'tour', // Populate the tour field in the Booking schema
    populate: {
      path: 'company', // Populate tourid within the tour reference
      model: 'Company' // Specify the model if required
    }
  });       
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error in getAllBookings:', error); // Log detailed error
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// DELETE method to remove a booking by ID
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// PUT method to update an existing booking by ID
exports.updateBooking = async (req, res) => {
    try {
        const { bookingDate, numOfPersons, totalCharges, comments, approved, number,kid, adult,elder } = req.body;

        // Find the booking by ID
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update fields if provided
        if (bookingDate) booking.bookingDate = bookingDate;
        if (numOfPersons) booking.numOfPersons = numOfPersons;
        if (totalCharges) booking.totalCharges = totalCharges;
        if (comments) booking.comments = comments;
        if (typeof approved === 'boolean') booking.approved = approved;
        if (number) booking.number = number;
        if (kid) booking.kid = kid;
        if (adult) booking.adult = adult;
        if (elder) booking.elder = elder;
        // Save the updated booking to the database
        const updatedBooking = await booking.save();
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// get BookingStatus
exports.getBookingStatus= async (req, res) => {
    try {
        const bookings = await BookingStatus.find()
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error in getAllBookings:', error); // Log detailed error
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
