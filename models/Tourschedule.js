const mongoose = require('mongoose');
const { Schema } = mongoose;
const tourScheduleSchema = new Schema({
  tourid: {type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true},
  schedules: [
    {
      title: String,
      description: String,
      time: String,
      city:String,
     date:Date,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
const TourSchedule = mongoose.model('TourSchedule', tourScheduleSchema);
module.exports = TourSchedule;