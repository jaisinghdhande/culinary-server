const dishService = require('../services/dishService');

const getAllDishes = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'name', 
            order = 'asc',
            diet,
            course,
            flavor_profile
        } = req.query;

        console.log(req.query);

        // Build filters object
        const filters = {
            diet,
            // Parse JSON strings from query params
            course: course ? JSON.parse(course) : undefined,
            flavor_profile: flavor_profile ? JSON.parse(flavor_profile) : undefined,
            sortBy,
            order
        };

        const result = await dishService.getAllDishes(page, limit, sortBy, order, filters);
        res.json(result);
    } catch (error) {
        console.error('Error in getAllDishes:', error);
        if (error instanceof SyntaxError) {
            return res.status(400).json({ 
                message: 'Invalid filter format. Arrays should be JSON strings.' 
            });
        }
        res.status(500).json({ message: error.message || 'Error fetching dishes' });
    }
};

const searchDishes = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const result = await dishService.searchDishes(q.trim());
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getDishById = async (req, res) => {
    try {
        const dish = await dishService.getDishById(req.params.id);
        res.json(dish);
    } catch (error) {
        console.error('Error in getDishById:', error);
        if (error.message === 'Dish not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message || 'Error fetching dish' });
    }
};

const getFilterOptions = async (req, res) => {
    try {
        const options = await dishService.getFilterOptions();
        res.json(options);
    } catch (error) {
        console.error('Error in getFilterOptions:', error);
        res.status(500).json({ message: error.message || 'Error fetching filter options' });
    }
};

const findDishesByIngredients = async (req, res) => {
    try {
        const { ingredients } = req.body;

        // Validate input
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a non-empty array of ingredients'
            });
        }

        // Clean ingredients array - remove empty strings and whitespace
        const cleanedIngredients = ingredients
            .map(ing => ing.trim())
            .filter(ing => ing.length > 0);

        if (cleanedIngredients.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide valid ingredients'
            });
        }

        const result = await dishService.findDishesByIngredients(cleanedIngredients);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllIngredients = async (req, res) => {
    try {
        const result = await dishService.getAllIngredients();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllDishes,
    getDishById,
    getFilterOptions,
    searchDishes,
    findDishesByIngredients,
    getAllIngredients
}; 