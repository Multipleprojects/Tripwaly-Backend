const Category = require("../models/Category");
const { Port } = require("../middleware/Port");
const path = require("path");
const sharp = require("sharp");

// Create a new category
exports.createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const timestamp = Date.now();
    let CategoryImage = null;

    if (req.files && req.files.image) {
      const image = req.files.image;
      const originalPath = path.join(__dirname, "../tour-images", `${timestamp}-${image.name}`);
      const compressedPath = path.join(__dirname, "../tour-images", `compressed-${timestamp}-${image.name}`);

      if (image.size > 1 * 1024 * 1024) {
        // Compress and save the image
        await sharp(image.data)
          .resize({ width: 800 }) // Resize
          .jpeg({ quality: 10 }) // Reduce quality
          .toFile(compressedPath);
        CategoryImage = `${Port}/compressed-${timestamp}-${image.name}`;
      } else {
        // Save the image as-is
        await new Promise((resolve, reject) => {
          image.mv(originalPath, (err) => {
            if (err) {
              console.error("Image upload error:", err);
              reject(new Error("Failed to upload image"));
            } else {
              resolve();
            }
          });
        });
        CategoryImage = `${Port}/${timestamp}-${image.name}`;
      }
    }

    const newCategory = new Category({
      name,
      image: CategoryImage,
    });

    await newCategory.save();
    return res.status(201).json({ message: "Category created successfully", category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error.message);
    return res.status(500).json({ error: "Error creating category", errorMessage: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return res.status(500).json({ error: "Error fetching categories", errorMessage: error.message });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error.message);
    return res.status(500).json({ error: "Error fetching category", errorMessage: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  const { name } = req.body;
  let CategoryImage = null;

  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (req.files && req.files.image) {
      const image = req.files.image;
      const timestamp = Date.now();
      const originalPath = path.join(__dirname, "../tour-images", `${timestamp}-${image.name}`);
      const compressedPath = path.join(__dirname, "../tour-images", `compressed-${timestamp}-${image.name}`);

      if (image.size > 1 * 1024 * 1024) {
        await sharp(image.data)
          .resize({ width: 800 })
          .jpeg({ quality: 10 })
          .toFile(compressedPath);
        CategoryImage = `${Port}/compressed-${timestamp}-${image.name}`;
      } else {
        await new Promise((resolve, reject) => {
          image.mv(originalPath, (err) => {
            if (err) {
              console.error("Image upload error:", err);
              reject(new Error("Failed to upload image"));
            } else {
              resolve();
            }
          });
        });
        CategoryImage = `${Port}/${timestamp}-${image.name}`;
      }
    }

    category.name = name || category.name;
    if (CategoryImage) {
      category.image = CategoryImage;
    }

    await category.save();
    return res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error.message);
    return res.status(500).json({ error: "Error updating category", errorMessage: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    return res.status(500).json({ error: "Error deleting category", errorMessage: error.message });
  }
};
