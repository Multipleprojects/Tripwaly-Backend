const express = require('express');
const router = express.Router();
const galleryController = require('../controller/Gallery-controller');

const upload = require('../middleware/multer');
router.post('/create',  galleryController.createGallery);
router.get('/get', galleryController.getAllGalleries);
router.get('get/:id', galleryController.getGalleryById);
router.put('/update/:id', galleryController.updateGallery);
router.delete('/delete/:id', galleryController.deleteGallery);


module.exports = router;
