const multer = require('multer');
const path = require('path');
// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tour-images'); // Specify the directory to save the uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save the file with a unique name
  }
});
const upload = multer({ storage: storage });
module.exports = upload;
