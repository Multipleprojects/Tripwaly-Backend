const { default: slugify } = require('slugify');
const Tour = require('../models/Tour');
const path = require('path');
const { Port } = require('../middleware/Port');
const fs = require('fs');
const TourCity=require('../models/cities')
const Company=require('../models/Company');

exports.createTour = async (req, res) => {
  try {
    const {
     company,
      title,
      description,
      fromcity,
      tocity,
      price,
      include,
      notinclude,
      duration,
      fromdate,
      time,
      todate,
      tags,
      availableseats,
      category,
      companyemail
    } = req.body;
    let parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
    let parsedCategory = Array.isArray(category) ? category : JSON.parse(category);
    let parsedInclude = Array.isArray(include) ? include : JSON.parse(include);
    let parsedNotInclude = Array.isArray(notinclude) ? notinclude : JSON.parse(notinclude);
    

    //company
    const validatedCompany = await Company.findById(company);
    if (!validatedCompany) {
      return res.status(400).json({ message: "The company you are looking for does not exist. Please check the information and try again." });
    }
    const timestamp = Date.now();
    let images = [];
    if (req.files && req.files.images) {
      const uploadedImages = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const image of uploadedImages) {
        const uploadPath = path.join(__dirname, '..', 'tour-images', `${timestamp}-${image.name}`);
        try {
          fs.writeFileSync(uploadPath, image.data); // Save the image data to the file
          images.push(`${Port}/${timestamp}-${image.name}`);
        } catch (err) {
          console.error('Image upload error:', err);
          throw new Error('Failed to upload image');
        }
      }
    }
    const slug = slugify(`${tocity}`, { lower: true, strict: true }) + '-' + Math.floor(Math.random() * 10000);
  const newTour = new Tour({
      company, 
      featured:false,
      active:true,
      title,
      description,
      fromcity,
      tocity,
      price,
      duration,
      slug,
      fromdate,
      time,
      todate,
      tags:parsedTags,
      include:parsedInclude,
      notinclude:parsedNotInclude,
      availableseats,
      category:parsedCategory,
      images,
      companyemail
    });

    // Update company tour count
    const companyTourAdd = await Company.findById(newTour.company);
    if (companyTourAdd) {
      companyTourAdd.counttour += 1;
      await companyTourAdd.save();
    }
    const cityTourDoc = await TourCity.findOne({ 'citytour.cityname': newTour.tocity });
    if (cityTourDoc) {
      const city = cityTourDoc.citytour.find(c => c.cityname === newTour.tocity);
      if (city) {
        city.tourcount += 1; 
        city.image = newTour.images || city.image; // Update city image with the tour's image
      }
      await cityTourDoc.save();
    }

    await newTour.save();
    res.status(201).json(newTour);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Error creating tour: ' + error.message });
  }
};


exports.updateTour = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Ensure tags are properly handled from the request
    let parsedTags = [];
    let parsedCategory = [];

    // Only attempt to parse 'tags' if it's a valid JSON string or array
    if (req.body.tags) {
      parsedTags = Array.isArray(req.body.tags) ? req.body.tags : JSON.parse(req.body.tags);
    }

    // Only attempt to parse 'category' if it's a valid JSON string or array
    if (req.body.category) {
      parsedCategory = Array.isArray(req.body.category) ? req.body.category : JSON.parse(req.body.category);
    }

    // Handle image updates using mv() method
    if (req.files && req.files.images) {
      const images = [];
      const uploadedImages = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

      // Process each uploaded image
      for (const image of uploadedImages) {
        const uploadPath = path.join(__dirname, '..', 'tour-images', `${Date.now()}-${image.name}`);

        // Move the image to the target directory
        await new Promise((resolve, reject) => {
          image.mv(uploadPath, (err) => {
            if (err) {
              console.error("Image upload error:", err);
              reject(new Error("Failed to upload image"));
            } else {
              images.push(`${Port}/tour-images/${Date.now()}-${image.name}`);  // Add image URL to array
              resolve();
            }
          });
        });
      }

      // Add the new images array to the updates object
      updates.images = images;
    }

    // Add tags to the updates object if they are available
    if (parsedTags.length > 0) {
      updates.tags = parsedTags;
    }

    // Add category to the updates object if it is available
    if (parsedCategory.length > 0) {
      updates.category = parsedCategory;
    }

    // Find and update the tour
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    if (!updatedTour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Send the updated tour in response
    res.status(200).json(updatedTour);
  } catch (error) {
    console.error("Update error:", error);  // Log the error for debugging
    res.status(500).json({ message: 'Error updating tour: ' + error.message });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Decrease the tour count for the associated company
    const companyTourRemove = await Company.findById(tour.company);
    if (companyTourRemove) {
      companyTourRemove.counttour -= 1;
      await companyTourRemove.save();
    }

    if (tour) {
      const cityName = tour.tocity;
      // Update the city tour count in the TourCity collection
      const cityTourDoc = await TourCity.findOne({ 'citytour.cityname': cityName });
      if (cityTourDoc) {
        const city = cityTourDoc.citytour.find((c) => c.cityname === cityName);
        if (city && city.tourcount > 0) {
          city.tourcount -= 1;
          await cityTourDoc.save();
        }
      }
    }
  
    

    // Delete the tour after updating the Tourcity
    await Tour.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tour: ' + error.message });
  }
};


exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find().populate('company');
        res.status(200).json(tours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getToursByID = async (req, res) => {
  try {
    const tours = await Tour.findById(req.params.id)
      .populate('company');
    res.status(200).json(tours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getcompanytour = async (req, res) => {
  try {
    const tours = await Tour.find()
      .populate('admin', 'name email role')
      .populate('company', 'name email role companyName');
    res.status(200).json(tours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTourCity = async (req, res) => {
  try {
    const tours = await CityTour.find()
         res.status(200).json(tours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

