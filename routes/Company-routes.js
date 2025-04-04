const express = require('express');
const router = express.Router();
const companyController = require('../controller/Company-controller');
const { verifyToken } = require('../middleware/authadmin');

// Route to create a new company
router.post('/create', companyController.createCompany);
// Route to get all companies
router.get('/get',companyController.getAllCompanies);
// Route to get by id companies
router.get('/get/:id',companyController.getById);

// Route to update a company by ID
router.put('/update/:id', companyController.updateCompany);

router.put('/updatestatus/:id', companyController.updateCompanyStatus);

//Route to sentotp
router.post('/sendOtp',companyController.sendOtp)

//update forget password
router.put('/resetpassword',companyController.resetPassword)
// Route to delete a company by ID
router.delete('/delete/:id', companyController.deleteCompany);

// Route for company login
router.post('/login', companyController.loginCompany);                  

module.exports = router;
