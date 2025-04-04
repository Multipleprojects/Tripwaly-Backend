const express = require('express');
const router = express.Router();
const TourScheduleController = require('../controller/Tourschedule-controller');
// Create or update a tour schedule
router.post('/create', TourScheduleController.createTourSchedule);   
// Add Schedules by TourSchedule ID
router.post('/create/:id', TourScheduleController.addSchedulesByTourScheduleId);
// Get all tour schedules
router.get('/get', TourScheduleController.getTourSchedules);
// Update a specific schedule item by schedule_id and scheduleObjId
router.put('/update/:id', TourScheduleController.updateTourSchedule);
/* upload.array('images', 10), */
// Get all tour schedules
router.get('/get/:id', TourScheduleController.getTourSchedulesById);
//Delete a tour schedule  by  ID
router.delete('/delete/:id',TourScheduleController.deleteTourSchedule);

module.exports = router;
