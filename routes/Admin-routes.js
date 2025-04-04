const express = require('express');
const router = express.Router();
const adminController = require('../controller/Admin-controller');
// Route to create a default admin
router.post('/create-default', adminController.createDefaultAdmin);
// Route to create a new admin
router.post('/create', adminController.createAdmin);
// Route to get all admins
router.get('/get', adminController.getAdmins);
// Route to update an existing admin by ID
router.put('/update/:id', adminController.updateAdmin);
// Route to delete an admin by ID
router.delete('/delete/:id', adminController.deleteAdmin);
// Route for admin login
router.post('/login', adminController.loginAdmin);
router.post('/validate-email', adminController.validateEmail);


//Route to sentotp
router.post('/sendOtp',adminController.sendOtp)

//update forget password
router.put('/resetpassword',adminController.resetPassword)

module.exports = router;
