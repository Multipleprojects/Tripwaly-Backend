const mongoose = require('mongoose');
const BookingSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
   default:null
    }, 
    tour: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tour', 
        required: true 
    }, 
   
    bookingDate: { 
        type: Date, 
    },
    
    fullname: { 
        type: String,  
    },
    number: { 
        type: String,  
    }, 
    totalCharges: { 
        type: Number,  
    }, // Total charges for the booking
    numOfPersons: { 
        type: Number,  
    }, // Number of persons in the booking
    kid: { 
        type: Number, 
    },
    adult: { 
        type: Number,  
    }, 
    elder: { 
        type: Number,  
    },
    comments: { 
        type: String, 
        default: '' 
    }, // Optional comments
    approved: { 
        type: Boolean, 
        default: false 
    }, // Approval status
createddate:{type:Date, default:Date.now}
});
module.exports = mongoose.model('Booking', BookingSchema);
