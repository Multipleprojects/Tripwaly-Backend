// controllers/companyController.js
const Company = require('../models/Company');
const { Port } = require('../middleware/Port');
const sharp = require('sharp');
const path = require('path');
const bcrypt = require('bcryptjs');
const Cities=require('../models/cities')
const TourSchedule=require('../models/Tour')
const sendVerificationEmail= require('../middleware/email')

exports.createCompany = async (req, res) => {
  const { name, companyName, email, password, phoneNumber, companyAddress, description } = req.body;
  try {
    // Check if an image file was uploaded
    if (!req.files || !req.files.images) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const timestamp = Date.now();
    const image = req.files.images;
    const originalPath = path.join(__dirname, '../tour-images', `${timestamp}-${image.name}`);
    const compressedPath = path.join(__dirname, '../tour-images', `compressed-${timestamp}-${image.name}`);

    // Compress the image if it's larger than 1MB
    if (image.size > 1 * 1024 * 1024) {
      await sharp(image.data)
        .resize({ width: 800 }) // Optional resizing
        .jpeg({ quality: 10 }) // Compress to reduce size
        .toFile(compressedPath);
    } else {
      // Save the image as-is if size is less than 1MB
      await new Promise((resolve, reject) => {
        image.mv(originalPath, (err) => {
          if (err) {
            console.error('Image upload error:', err);
            reject(new Error("Failed to upload image"));
          } else {
            resolve();
          }
        });
      });
    }

    // Check if email, phone number, or company name already exists
    const emailExists = await Company.findOne({ email });
    if (emailExists) {
      return res.status(400).send('Email is already registered');
    }
    const phoneExists = await Company.findOne({ phoneNumber });
    if (phoneExists) {
      return res.status(400).send('Phone number is already registered');
    }
    const companynameExists = await Company.findOne({ companyName });
    if (companynameExists) {
      return res.status(400).send('Company Name is already registered');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new company
    const newCompany = new Company({
      name,
      companyName,
      email,
      password: hashedPassword,
      phoneNumber,
      companyAddress,
      description,
      companyimage: image.size > 1 * 1024 * 1024 
        ? `${Port}/compressed-${timestamp}-${image.name}` 
        : `${Port}/${timestamp}-${image.name}`
    });

    await newCompany.save();
    res.status(201).send({message:'Company created successfully', company:newCompany});
  } catch (error) {
    res.status(500).send('Error creating company: ' + error.message);
  }
};

//Get method
exports.getAllCompanies = async (req, res) => {
    try {
      const companies = await Company.find();
      res.status(200).json(companies);
    } catch (error) {
      res.status(500).send('Error retrieving companies: ' + error.message);
    }
  };
//Get Company by id
exports.getById = async (req, res) => {
  try {
    const companyId = req.params.id; 

    if (!companyId) {
      return res.status(400).json({ message: "ID parameter is missing" });
    }

    const getCompany = await Company.findById(companyId);

    if (!getCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(getCompany);
  } catch (err) {
    // Log and return the error message
    console.error("Error occurred in getById:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

  exports.updateCompany = async (req, res) => {
    const { name, companyName, email, password, phoneNumber, companyAddress, description, active } = req.body;
  
    try {
      // Fetch the company to update
      let company = await Company.findById(req.params.id);
      if (!company) {
        return res.status(404).send('Company not found');
      }
  
      // Check for duplicate email or phone number
      const emailExists = await Company.findOne({ email });
      if (emailExists && emailExists._id.toString() !== req.params.id) {
        return res.status(400).send('Email is already registered by another company');
      }
  
      const phoneExists = await Company.findOne({ phoneNumber });
      if (phoneExists && phoneExists._id.toString() !== req.params.id) {
        return res.status(400).send('Phone number is already registered by another company');
      }
  
      // Handle password update
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
      }
  
      // Handle image upload and compression
      if (req.files && req.files.images) {
        const image = req.files.images;
        const timestamp = Date.now();
        const compressedPath = path.join(__dirname, '..', 'tour-images', `compressed-${timestamp}-${image.name}`);
  
        // Compress and save the new image
        await sharp(image.data)
          .resize({ width: 800 }) // Optional resizing
          .jpeg({ quality: 80 }) // Adjust quality as needed
          .toFile(compressedPath);
  
        // Update the image path in the request body
        req.body.companyimage = `${Port}/compressed-${timestamp}-${image.name}`;
      } else {
        // Retain the current image if no new one is uploaded
        req.body.companyimage = company.companyimage;
      }
  
      // Update the company with the new data
      const updateData = req.body;
      company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
  
      res.status(200).json(company);
    } catch (error) {
      console.error('Error updating company:', error.message);
      res.status(500).send('Error updating company: ' + error.message);
    }
  };

  exports.updateCompanyStatus = async (req, res) => {
    try {
      // Find the company by ID
      let company = await Company.findById(req.params.id);
      if (!company) {
        return res.status(404).send('Company not found');
      }
      // Update the company
      company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      // Find tours associated with the company
      const companyTour = await TourSchedule.find({ company: company._id });
  
      // Extract city names into an array
      const tocityArray = companyTour.map((tour) => tour.tocity);
      console.log("Tocity Array:", tocityArray);
  
      // Create a frequency map of the cities
      const cityFrequency = {};
      tocityArray.forEach((city) => {
        cityFrequency[city] = (cityFrequency[city] || 0) + 1;
      });
      console.log("City Frequency:", cityFrequency);
  if(company.active===true)
  {
      // Find existing cities in the `Cities` collection
      const existCities = await Cities.find({
        'citytour.cityname': { $in: Object.keys(cityFrequency) },
      });
  
      // Update tour counts for matched cities
      if (existCities.length > 0) {
        for (let city of existCities) {
          city.citytour.forEach((ct) => {
            if (cityFrequency[ct.cityname]) {
              ct.tourcount += cityFrequency[ct.cityname];
            }
          });
          await city.save(); // Save changes to the document
        }
      } else {
        console.log("No matching cities found.");
      }
    }
  else{
          const existCities = await Cities.find({
            'citytour.cityname': { $in: Object.keys(cityFrequency) },
          });
      
          // Update tour counts for matched cities
          if (existCities.length > 0) {
            for (let city of existCities) {
              city.citytour.forEach((ct) => {
                if (cityFrequency[ct.cityname]) {
                  ct.tourcount -= cityFrequency[ct.cityname];
                }
              });
              await city.save(); 
            }
          } else {
            console.log("No matching cities found.");
          }
        }
      
     
      // Send response
      res.status(200).json(company);
  
    } catch (error) {
      console.error('Error updating company:', error.message);
      res.status(500).send('Error updating company: ' + error.message);
    }
  };
  
   
   //delete method
exports.deleteCompany = async (req, res) => {
    try {
      const company = await Company.findById(req.params.id);
      if (!company) {
        return res.status(404).send('Company not found');
      }
  
      await Company.findByIdAndDelete(req.params.id);
      res.status(200).send('Company deleted successfully');
    } catch (error) {
      res.status(500).send('Error deleting company: ' + error.message);
    }
  };
 // Route: POST /api/send-otp
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the company by email
    const existEmail = await Company.findOne({ email });
    if (!existEmail) {
      return res.status(404).json({ message: 'Email address not found. Please sign up first.' });
    }
    // Generate OTP
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', verificationOTP);

    // Save OTP to database
    await Company.findOneAndUpdate(
      { email: existEmail.email },
      { verificationCode: verificationOTP },
      { new: true }
    );

    // Send OTP to the email
    await sendVerificationEmail(verificationOTP, email);

    console.log('OTP sent to email:', verificationOTP);
    return res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while sending OTP.' });
  }
};

// Route: PUT /api/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, verificationCode, password } = req.body;

    // Find the company by email
    const existEmail = await Company.findOne({ email });
    if (!existEmail) {
      return res.status(404).json({ message: 'Email address not found. Please sign up first.' });
    }

    // Verify the OTP
    if (verificationCode !== existEmail.verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password in the database
    await Company.findOneAndUpdate(
      { email: existEmail.email },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while updating the password.' });
  }
};

//Company login
exports.loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;
    //  admin email
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(401).json({ message: 'Invalid email ' });
  }

    // Check if the company is found and compare passwords
    if (company) {
      const isPasswordMatch = await bcrypt.compare(password, company.password);
            // Compare password
            if (!isPasswordMatch) {
                return res.status(401).json({ message: 'Invalid password', id:company._id  });
            }
      
        return res.status(200).send({
          company,
          message: 'Login successful. Welcome, company!',
        });
      }
    
    // If no company is found, send error message
    res.status(401).send({
      message: 'Invalid email or password. Please try again.',
    });
  
  } catch (error) {
    res.status(500).send({
      message: 'An error occurred while processing your request. Please try again later.',
      error: error.message,
    });
  }
};

  