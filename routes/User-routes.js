const express = require('express');
const router = express.Router();
const userController = require('../controller/User-controller');
// Route to create a new user
router.post('/create',userController.createUser);
// Route to get all users
router.get('/get', userController.getAllUsers);
//getbyid
router.get('/get/:id', userController.getUserbyid);

// Route for user update
router.put('/update/:id', userController.updateUser);

//Route to sentotp
router.post('/sendOtp',userController.sendOtp)

//update forget password
router.put('/resetpassword',userController.resetPassword)


router.delete('/delete/:id', userController.deleteByid);
// Route for user login
router.post('/login', userController.loginUser);


module.exports = router;
