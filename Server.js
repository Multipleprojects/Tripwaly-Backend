// Import packages
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileupload=require('express-fileupload');
const path=require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
// Initialize express app
const app = express();
app.use(express.json());
app.use(fileupload());
app.use(cors());
app.use('/tour-images', express.static(path.join(__dirname, 'tour-images')));
// Enable express-fileupload
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '100mb' })); 
app.use(express.urlencoded({ limit: '100mb', extended: true }));
// Route modules
app.use('/admin', require('./routes/Admin-routes'));
app.use('/user', require('./routes/User-routes'));
app.use('/tour', require('./routes/Tour-routes'));
app.use('/user/booking', require('./routes/Booking-routes'));
app.use('/user/review', require('./routes/Review-routes'));
app.use('/tour/city', require('./routes/Cities-routes'));
app.use('/company', require('./routes/Company-routes'));
app.use('/user/subscription', require('./routes/Subscription-routes'));
app.use('/tour/schedule', require('./routes/Tourschedule-routes'));
app.use('/gallery', require('./routes/Gallery-routes'));
app.use('/metadata', require('./routes/Metadata-routes'));
app.use('/servicedata', require('./routes/ServiceData-routes'));
app.use('/achievements', require('./routes/Achievements-routes'));
app.use('/', require('./routes/GetMessage_routes'));
app.use('/category', require('./routes/CategoryRoutes'));

// app.use('/tour/faqs', require('./routes/FAQS-routes'));
// app.use('/', require('./routes/dummydata/dummy'));

// Database connection
//const url = "mongodb+srv://tourism:umEUY3Cfk0GzxFxF@tour.cug95.mongodb.net/?retryWrites=true&w=majority&appName=tour";
//const url="mongodb://user:tripwaly@db.tripwaly.com:27017/tripwaly_db";

//const url="mongodb://127.0.0.1:27017/House_of_Tutor"; 
   if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in the .env file");
    }
  const url=process.env.DATABASE_URL;
console.log(`The URL is: ${url}`);
// mongoose.set('strictQuery', true);

// Handle database connection and errors gracefully
mongoose.connect(url)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Error occurred in database connection:", err.message);
  });

// Handle Mongoose connection errors without crashing the app
mongoose.connection.on('error', (err) => {
  console.error("Mongoose connection error:", err.message);
});

// Listen for disconnection events
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from the database');
});

// Create and start the server on the specified port
const PORT = 8000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error.message);
});

