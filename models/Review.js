const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
    }, 
    tour: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tour', 
    }, 
   
    review: { 
        type: String, 
    }, // User's review text
    rating: { 
        type: Number, 
    }, 
    images: { 
        type: String 
    }, 
    createddate: { 
        type: Date, 
        default: Date.now 
    } ,
    publish:{type:Boolean, default:false}
});
module.exports = mongoose.model('Review', ReviewSchema);
