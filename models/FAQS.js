const mongoose = require('mongoose');
const FAQSSchema = new mongoose.Schema({
    tour: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tour', 
        required: true 
    },
    TourFAQS:[
        {
            question:String,
            answer:String
        }
    ]
});
const FAQSmodel = mongoose.model('FAQSmodel', FAQSSchema);
module.exports = FAQSmodel;
