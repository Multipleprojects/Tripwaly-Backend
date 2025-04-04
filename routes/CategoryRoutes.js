const express = require("express");
const router = express.Router();
const categoryController = require("../controller/CategoryController");

// Create category
router.post("/create", categoryController.createCategory);

// Get all categories
router.get("/", categoryController.getCategories);

// Get a single category by ID
router.get("/:id", categoryController.getCategoryById);

// Update category
router.put("/update/:id", categoryController.updateCategory);

// Delete category
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;
