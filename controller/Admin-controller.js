const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
// Create Default Admin
exports.createDefaultAdmin = async () => {
  try {
    const admin = await Admin.findOne({ role: 'admin' });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('rafay1234', 10);
      const newAdmin = new Admin({
        name: 'rafay',
        email: 'rafay@gmail.com',
        password: hashedPassword,
        role: 'admin',
        active: true,
      });
      await newAdmin.save();
      console.log('Admin created successfully');
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};
// POST method to create a new admin
exports.createAdmin = async (req, res) => {
  const { name, email, password, role, active } = req.body;
  try {
    // Check if email already exists
    const emailExists = await Admin.findOne({ email });
    if (emailExists) {
      return res.status(400).send('Email is already registered');
    }
    // Hash the provided password
    const hashedPassword = await bcrypt.hash(password, 10);
    const admins = await Admin.find({});
    for (let admin of admins) {
      const isPasswordMatch = await bcrypt.compare(password, admin.password);
      if (isPasswordMatch) {
        return res.status(400).send('Password is already in use');
      }
    }
    // Create and save the new admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: role || 'admin',
      active: active !== undefined ? active : true,
    });
    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).send('Error creating admin: ' + error.message);
  }
};
// GET method to retrieve all admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).send('Error retrieving admins: ' + error.message);
  }
};
// PUT method to update an existing admin
exports.updateAdmin = async (req, res) => {
  const { name, email, password, active } = req.body;

  try {
    // Check if the admin exists
    let admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).send('Admin not found');
    }

    // Check if the email is being updated and if it already exists
    if (email && email !== admin.email) {
      const emailExists = await Admin.findOne({ email });
      if (emailExists) {
        return res.status(400).send('Email is already registered by another admin');
     return;
      }
      admin.email = email;
    }
    // Hash the new password if provided
    if (password) {
      // Check if the new password is already in use
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingAdmins = await Admin.find({ _id: { $ne: req.params.id } }); // Exclude current admin
      for (let existingAdmin of existingAdmins) {
        const isPasswordMatch = await bcrypt.compare(password, existingAdmin.password);
        if (isPasswordMatch) {
          return res.status(400).send('Password is already in use by another admin');
        }
      }
      admin.password = hashedPassword;
    }

    // Update other fields
    if (name) admin.name = name;
    if (active !== undefined) admin.active = active;

    // Save the updated admin
    await admin.save();
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).send('Error updating admin: ' + error.message);
  }
};
// DELETE method to delete an admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).send('Admin not found');
    }
    res.status(200).send('Admin deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting admin: ' + error.message);
  }
};
//Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (admin) {
      const isPasswordMatch = await bcrypt.compare(password, admin.password);
      if (isPasswordMatch) {
        return res.status(200).send({
          admin,
          message: 'Login successful. Welcome, admin!',
        });
      } else {
        return res.status(401).send({
          message: 'Invalid password. Please try again.',
        });
      }
    } else {
      return res.status(401).send({
        message: 'Admin not found. Invalid email.',
      });
    }
  } catch (error) {
    console.error('Login error:', error); // Log the error for debugging
    res.status(500).send({
      message: 'An error occurred while processing your request. Please try again later.',
      error: error.message,
    });
  }
};
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the Admin by email
    const existEmail = await Admin.findOne({ email });
    if (!existEmail) {
      return res.status(404).json({ message: 'Email address not found. Please sign up first.' });
    }
    // Generate OTP
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', verificationOTP);

    // Save OTP to database
    await Admin.findOneAndUpdate(
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

    // Find the Admin by email
    const existEmail = await Admin.findOne({ email });
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
    await Admin.findOneAndUpdate(
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

// Validate Email
exports.validateEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });

    res.status(200).json({ adminId: admin._id });
  } catch (error) {
    res.status(500).json({ message: 'Error validating email.', error });
  }
};