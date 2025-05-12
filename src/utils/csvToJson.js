const fs = require('fs');
const path = require('path');

function sanitizeValue(value) {
    if (value === '-1' || value === '') {
        return null;
    }
    return value;
}

function parseIngredients(ingredientsStr) {
    if (!ingredientsStr) return [];
    return ingredientsStr.split(',').map(ingredient => ingredient.trim());
}

function convertCsvToJson() {
    try {
        // Read the CSV file
        const csvPath = path.join(__dirname, '../../indian_food.csv');
        const csvData = fs.readFileSync(csvPath, 'utf-8');
        
        // Split into lines and remove empty lines
        const lines = csvData.split('\n').filter(line => line.trim());
        
        // Get headers
        const headers = lines[0].split(',').map(header => header.trim());
        
        // Process each line
        const jsonData = lines.slice(1).map(line => {
            const values = line.split(',').map(value => value.trim());
            const dish = {};
            
            headers.forEach((header, index) => {
                if (header === 'ingredients') {
                    dish[header] = parseIngredients(values[index]);
                } else {
                    dish[header] = sanitizeValue(values[index]);
                }
            });
            
            return dish;
        });

        // Write to JSON file
        const jsonPath = path.join(__dirname, '../../data/indian_food.json');
        fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
        
        console.log('CSV successfully converted to JSON');
        return jsonData;
    } catch (error) {
        console.error('Error converting CSV to JSON:', error);
        throw error;
    }
}

module.exports = convertCsvToJson; 