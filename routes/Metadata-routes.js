const express = require('express');
const router = express.Router();
const MetadataController = require('../controller/Metadata-controller');

// POST - Create a new Metadata
router.post('/create', MetadataController.createMetadata);

// GET - Retrieve all Metadata
router.get('/get', MetadataController.getAllMetadata);

// GET - Retrieve a Metadata by ID
router.get('/:id', MetadataController.getMetadataById);

// PUT - Update a Metadata by ID
router.put('/update/:id', MetadataController.updateMetadata);

// DELETE - Delete a Metadata by ID
router.delete('/:id', MetadataController.deleteMetadata);

module.exports = router;
