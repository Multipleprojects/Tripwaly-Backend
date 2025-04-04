const mongoose = require('mongoose');
const Tourcity = require('../models/cities');

// Create a new Tourcity
exports.createTourCity = async (req, res) => {
  try {
    const { citytour } = req.body;

    if (!citytour || !Array.isArray(citytour)) {
      return res.status(400).json({ message: 'Invalid or missing citytour array.' });
    }

    const newTourCity = new Tourcity({ citytour });
    await newTourCity.save();

    res.status(201).json({
      message: 'Tour cities created successfully.',
      data: newTourCity,
    });
  } catch (error) {
    console.error('Error creating tour cities:', error.message);
    res.status(500).json({ message: 'Error creating tour cities.', error: error.message });
  }
};

exports.addCityToTour = async (req, res) => {
  try {
    const { id } = req.params; // Document ID
    const { cityname } = req.body; // New city details

    // Validate input
    if (!cityname) {
      return res.status(400).json({ message: "cityname is required." });
    }

    // Find the document by ID
    const tour = await Tourcity.findById(id);

    if (!tour) {
      return res.status(404).json({ message: "Document not found." });
    }

    // Check if city already exists in citytour array
    const cityExists = tour.citytour.some((city) => city.cityname.toLowerCase() === cityname.toLowerCase());

    if (cityExists) {
      return res.status(400).json({ message: `City '${cityname}' already exists.` });
    }

    // Add new city to the citytour array
    tour.citytour.push({ cityname, image: null, tourcount: 0 });

    // Save the updated document
    await tour.save();

    res.status(200).json({ message: "City added successfully!", data: tour });
  } catch (error) {
    res.status(500).json({ message: "Error adding city", error: error.message });
  }
};

// Get all Tourcity data
exports.getTourCities = async (req, res) => {
  try {
    const tourCities = await Tourcity.find();
    res.status(200).json(tourCities);
  } catch (error) {
    console.error('Error fetching tour cities:', error.message);
    res.status(500).json({ message: 'Error fetching tour cities.', error: error.message });
  }
};

// Get all Tourcity data with filter
exports.getFilteredTourCities = async (req, res) => {
  try {
    const tourCities = await Tourcity.find();

    // Filter cities where at least one tour has tourcount > 0
    const filteredTourCities = tourCities
      .map(city => ({
        ...city.toObject(),
        citytour: city.citytour.filter(tour => tour.tourcount > 0) // Keep only tours with tourcount > 0
      }))
      .filter(city => city.citytour.length > 0); // Remove cities with empty citytour arrays

    res.status(200).json(filteredTourCities);
  } catch (error) {
    console.error('Error fetching tour cities:', error.message);
    res.status(500).json({ message: 'Error fetching tour cities.', error: error.message });
  }
};



exports.updateCityByIndex = async (req, res) => {
  try {
    const { id } = req.params; // Document ID of the main tour
    const { index, newCity } = req.body; // 'index' is actually the _id of the city object

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(index)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    // Find the document by ID
    const tourcity = await Tourcity.findById(id);
    if (!tourcity) {
      return res.status(404).json({ message: "Tourcity not found." });
    }

    // Find the city by its _id inside the citytour array
    const cityIndex = tourcity.citytour.findIndex(city => city._id.toString() === index);

    if (cityIndex === -1) {
      return res.status(404).json({ message: "City not found in the tour." });
    }

    // Update the city name
    tourcity.citytour[cityIndex].cityname = newCity;

    // Save the updated document
    await tourcity.save();

    res.status(200).json({ message: "City updated successfully!", updatedCity: tourcity.citytour[cityIndex] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCityByIndex = async (req, res) => {
  try {
    const { id } = req.params; // Document ID
    const { index } = req.body; // City object ID

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(index)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    // Find the document by ID
    const tourcity = await Tourcity.findById(id);
    if (!tourcity) {
      return res.status(404).json({ message: 'Tourcity not found.' });
    }

    // Find the index of the city with the given _id
    const cityIndex = tourcity.citytour.findIndex(city => city._id.toString() === index);

    if (cityIndex === -1) {
      return res.status(404).json({ message: 'City not found in citytour array.' });
    }

    // Remove the city at the specified index
    tourcity.citytour.splice(cityIndex, 1);

    // Save the updated document
    await tourcity.save();

    res.status(200).json({ message: 'City deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete Cities
exports.deleteTourcity = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Tourcity.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Tour city not found" });
    }

    res.status(200).json({ message: "Tour city data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tour city", error });
  }
};
