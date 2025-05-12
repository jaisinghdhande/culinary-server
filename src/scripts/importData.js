require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const connectDB = require('../config/database');
const Dish = require('../models/Dish');

// Utility function to capitalize first letter
const capitalize = (str) => {
    if (!str) return null;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Utility function to safely convert to lowercase
const safeToLowerCase = (str) => {
    if (!str) return '';
    return String(str).toLowerCase();
};

// Utility function to safely trim strings
const safeTrim = (str) => {
    if (!str) return '';
    return String(str).trim();
};

// Utility function to safely parse numbers
const safeParseInt = (value) => {
    if (!value || value === '' || value === '-1') return null;
    const parsed = parseInt(value);
    return isNaN(parsed) || parsed < 0 ? null : parsed;
};

const transformData = (dishes) => {
    return dishes.map(dish => {
        // Split ingredients string into array and clean each ingredient
        const ingredients = dish.ingredients
            .split(',')
            .map(ing => capitalize(safeTrim(ing)))
            .filter(ing => ing);

        // Convert prep_time and cook_time to numbers, handle invalid values
        const prep_time = safeParseInt(dish.prep_time);
        const cook_time = safeParseInt(dish.cook_time);

        // Ensure diet is either 'vegetarian' or 'non-vegetarian'
        const diet = safeToLowerCase(dish.diet) === 'vegetarian' ? 'vegetarian' : 'non-vegetarian';

        // Map flavor profiles to valid enum values
        const flavorMap = {
            'sweet': 'sweet',
            'spicy': 'spicy',
            'bitter': 'bitter',
            'sour': 'sour'
        };
        const flavor_profile = flavorMap[safeToLowerCase(dish.flavor_profile)] || null;

        // Map courses to valid enum values
        const courseMap = {
            'main course': 'main course',
            'dessert': 'dessert',
            'snack': 'snack',
            'starter': 'starter'
        };
        const course = courseMap[safeToLowerCase(dish.course)] || 'main course';

        // Map regions to valid enum values
        const regionMap = {
            'north': 'North',
            'south': 'South',
            'east': 'East',
            'west': 'West',
            'north east': 'North East',
            'central': 'Central'
        };
        const region = regionMap[safeToLowerCase(dish.region)] || null;

        return {
            name: capitalize(safeTrim(dish.name)),
            ingredients,
            diet,
            prep_time,
            cook_time,
            flavor_profile,
            course,
            state: capitalize(safeTrim(dish.state)) || null,
            region
        };
    });
};

const importData = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Read CSV file
        const csvPath = path.join(__dirname, '../../indian_food.csv');
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        
        // Parse CSV content using csv-parse
        const records = parse(csvContent, {
            columns: true, // Use the first row as headers
            skip_empty_lines: true, // Skip empty lines
            trim: true, // Trim whitespace from fields
            cast: true, // Try to cast values to their appropriate types
            cast_date: false // Don't try to cast dates
        });

        // Transform data according to schema
        const transformedDishes = transformData(records);

        // Delete existing data
        await Dish.deleteMany({});

        // Insert new data
        await Dish.insertMany(transformedDishes);

        console.log('Data Imported Successfully');
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

module.exports = importData; 