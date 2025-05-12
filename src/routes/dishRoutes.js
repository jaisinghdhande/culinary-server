const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');

// Search dishes
router.get('/search', dishController.searchDishes);

// Get available filter options
router.get('/filter-options', dishController.getFilterOptions);

// Find dishes by ingredients
router.post('/by-ingredients', dishController.findDishesByIngredients);

// Get all distinct ingredients
router.get('/ingredients', dishController.getAllIngredients);

// Get all dishes (includes filtering, pagination, and sorting)
router.get('/', dishController.getAllDishes);

// Get dish by ID
router.get('/:id', dishController.getDishById);

module.exports = router; 