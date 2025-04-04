const mongoose = require('mongoose');

// Define the main schema with conditional references
const Tourschema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
    featured: { type: Boolean, default: false  },
    active: { type: Boolean, default: true },  
    title: String,
    description: String,
    fromcity: String,
    tocity: String,
    include:[String],
    notinclude:[String],
    distance: String,
    location: String,
    price: Number,
    postcode: Number,
    latitude: Number,
    longitude: Number,
    fromlatitude: Number,
    fromlongitude: Number,
    slug: String,
    duration: Number,
    images: [String],
    categoryImage:[String],
    fromdate: { type: Date, default: Date.now },
    time: String,
    todate: Date,
    tags: [String],
    ratingcount: { type: Number, default: 0 },
    ratingmembers: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    availableseats: Number,
    createddate: { type: Date, default: Date.now },
    category: [String],
    companyemail:{ type: String, default: null }
  },
  { timestamps: true }
);


module.exports = mongoose.model('Tour', Tourschema);
