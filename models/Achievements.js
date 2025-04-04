// models/achievements.js
const mongoose = require('mongoose');

const achievementschema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  successfulTrips: {
    type: Number,
    required: true,
   
  },
  regularClients: {
    type: Number,
    required: true,
   
  },
  yearsExperience: {
    type: Number,
    required: true,
  },
  img:String,
}, { timestamps: true });

const achievements = mongoose.model('achievements', achievementschema);
module.exports = achievements;
