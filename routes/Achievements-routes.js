// routes/achievementsRoutes.js
const express = require('express');
const { createachievements, getachievements, getachievementsById, updateachievements, deleteachievements } = require('../controller/Achievments-controller');

const router = express.Router();

// Route for creating a new achievements
router.post('/create', createachievements);

// Route for getting all achievements
router.get('/get', getachievements);

// Route for getting a single achievements by ID
router.get('/:id', getachievementsById);

// Route for updating a achievements by ID
router.put('/update/:id', updateachievements);

// Route for deleting a achievements by ID
router.delete('/:id', deleteachievements);

module.exports = router;
