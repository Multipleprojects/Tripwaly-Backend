const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { Port } = require('../middleware/Port');
const sharp = require('sharp');
const path=require('path')
const sendVerificationEmail= require('../middleware/email')

exports.createUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const timestamp = Date.now();
    let userImage = null;

    if (req.files && req.files.images) {
      const image = req.files.images;
      const originalPath = path.join(__dirname, '../tour-images', `${timestamp}-${image.name}`);
      const compressedPath = path.join(__dirname, '../tour-images', `compressed-${timestamp}-${image.name}`);

      if (image.size > 1 * 1024 * 1024) {
        // Compress and save the image
        await sharp(image.data)
          .resize({ width: 800 }) // Optional resizing
          .jpeg({ quality: 10 }) // Compress to reduce size
          .toFile(compressedPath);
        userImage = `${Port}/compressed-${timestamp}-${image.name}`;
      } else {
        // Save the image as-is
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
        userImage = `${Port}/${timestamp}-${image.name}`;
      }
    }

    // Check if the email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: 'This email is already registered. Please log in.' });
    }

    // Check if the phone number already exists
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ error: 'Phone number is already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      userimage: userImage,
    });

    await newUser.save();
    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error.message);
    return res.status(500).json({ error: 'Error creating user', errorMessage: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send('Error retrieving users: ' + error.message);
  }
};
// Get all users
exports.getUserbyid = async (req, res) => {
  try {
  
    const users = await User.findById(req.params.id);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send('Error retrieving users: ' + error.message);
  }
};
// PUT method to update an existing user
exports.updateUser = async (req, res) => {
  const { name, email, password, phone, active } = req.body;

  try {
    // Check if the user exists
    let user = await User.findById(req.params.id);
    
    // If the user doesn't exist, return a default response
    if (!user) {
      return res.status(200).json({ message: 'User does not exist. No update performed.' });
    }

    // Check if the email is being updated and if it already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).send('Email is already registered by another user');
      }
      user.email = email;
    }

    // Check if the phone number is being updated and if it already exists
    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).send('Phone number is already registered by another user');
      }
      user.phone = phone;
    }

    // Check if the password is being updated and hash it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Update other fields
    if (name) user.name = name;
    if (active !== undefined) user.active = active;

    // Save the updated user information
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send('Error updating user: ' + error.message);
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the User by email
    const existEmail = await User.findOne({ email });
    if (!existEmail) {
      return res.status(404).json({ message: 'Email address not found. Please sign up first.' });
    }
    // Generate OTP
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', verificationOTP);

    // Save OTP to database
    await User.findOneAndUpdate(
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

    // Find the User by email
    const existEmail = await User.findOne({ email });
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
    await User.findOneAndUpdate(
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


exports.deleteByid = async (req, res) => {
  try {
    // Attempt to find the user by ID and delete
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    // Check if the user was found and deleted
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return a success response if the user is deleted
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    // Send a more descriptive error message
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
// User login
exports.loginUser = async (req, res) => {
  try {
      const { email, password } = req.body;
      // Find user by email
      const user = await User.findOne({ email });
      
      if (!user) {
          return res.status(401).json({ message: 'Invalid email ' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid password',  });
      }
      
      res.status(200).json({
       user,
        message: 'Login successful',
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};
