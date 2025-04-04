const TourSchedule = require('../models/Tourschedule'); 
const Tour=require('../models/Tour');
const { Port } = require('../middleware/Port');
// Create Tour schedule
exports.createTourSchedule = async (req, res) => {
  try {
    const { tourid, schedules } = req.body;

    const validTour = await Tour.findById(tourid);
    if (!validTour) {
      return res.status(400).json({ message: "Invalid tour ID" });
    }

    if (!Array.isArray(schedules)) {
      return res.status(400).json({ message: "Schedules must be an array" });
    }

    let tourSchedule = await TourSchedule.findOne({ tourid });
    if (tourSchedule) {
      return res.status(200).json({ message: "Tour Schedule already created for the given tourid" });
    }


    // Create new tour schedule
    tourSchedule = new TourSchedule({
      tourid,
      schedules: schedules.map(schedule => ({
        title: schedule.title,
        description: schedule.description,
        time: schedule.time,
        date: schedule.date,
        city: schedule.city,
        createdAt: new Date(),
      })),
    });

    // Save tour schedule
    await tourSchedule.save();
    // Find and update the city tour count
   
    res.status(201).json(tourSchedule);

  } catch (error) {
    console.error("Error in createTourSchedule:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.addSchedulesByTourScheduleId = async (req, res) => {
  try {
    const { schedules } = req.body;
    const images = req.files ? req.files.map(file => file.path) : []; // Handle case where req.files is undefined
    const { id } = req.params; // Get the TourSchedule ID from params

    // Find the TourSchedule by its ID
    let tourSchedule = await TourSchedule.findById(id);
    if (!tourSchedule) {
      return res.status(404).json({ message: 'TourSchedule not found' });
    }
    // Loop through schedules to add
    for (const schedule of schedules) {
      // Check if a schedule with the same title already exists in the schedules array
      const existingSchedule = tourSchedule.schedules.find(s => s.title === schedule.title);

      if (existingSchedule) {
        return res.status(400).json({ message: `Schedule with title "${Port}/${schedule.title}" already exists in this tour schedule` });
      }
      // If no schedule with the same title exists, add the new schedule
      tourSchedule.schedules.push({
        title: schedule.title,
        description: schedule.description,
        time: schedule.time,
        city: schedule.city,
        lat: schedule.lat,
        long: schedule.long,
        images: schedule.images || [], // Handle case where images might not be provided
        createdAt: new Date()
      });
    }

    // Save the updated TourSchedule document
    await tourSchedule.save();
    res.status(201).json(tourSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tour schedules
exports.getTourSchedules = async (req, res) => {
  try {
    const tourSchedules = await TourSchedule.find().populate({path: 'tourid' });
    res.status(200).json(tourSchedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get tour by id
exports.getTourSchedulesById = async (req, res) => {
  try {
    const { id } = req.params;

  
    const getTour = await TourSchedule.findById(id).populate('tourid');
    
    if (!getTour) {
      return res.status(404).json({ message: 'Tour schedule not found for the provided ID' });
    }

    res.status(200).json(getTour);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};


exports.updateTourSchedule = async (req, res) => {
  try {
      const schedules = req.body.schedules || [];
      const processedSchedules = [];

      for (const schedule of schedules) {
          let updatedSchedule = { ...schedule };
          processedSchedules.push(updatedSchedule);
      }

      const updatedTourSchedule = await TourSchedule.findByIdAndUpdate(
          req.params.id,
          { schedules: processedSchedules, featured: req.body.featured, active: req.body.active },
          { new: true, runValidators: true }
      );

      res.status(200).json(updatedTourSchedule);
  } catch (error) {
      console.error("Error updating tour schedule:", error);
      res.status(500).json({ message: error.message });
  }
};

exports.deleteTourSchedule = async (req, res) => {
  try {
      // Delete the tour schedule
      await TourSchedule.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Tour schedule deleted successfully" });
    
  } catch (err) {
    console.error("Error deleting tour schedule:", err);
    res.status(500).json({ message: "Error occurred during tour schedule deletion" });
  }
};
