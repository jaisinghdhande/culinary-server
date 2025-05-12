const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    ingredients: [{
        type: String,
        trim: true
    }],
    diet: {
        type: String,
        enum: ['vegetarian', 'non-vegetarian'],
        required: true
    },
    prep_time: {
        type: Number,
        min: 0
    },
    cook_time: {
        type: Number,
        min: 0
    },
    flavor_profile: {
        type: String,
        enum: ['sweet', 'spicy', 'bitter', 'sour', null],
        default: null
    },
    course: {
        type: String,
        enum: ['main course', 'dessert', 'snack', 'starter'],
        required: true
    },
    state: {
        type: String,
        trim: true
    },
    region: {
        type: String,
        enum: ['North', 'South', 'East', 'West', 'North East', 'Central', null],
        default: null
    }
}, {
    timestamps: true
});

// Create text indexes for searchable fields
dishSchema.index({
    name: 'text',
    'ingredients': 'text',
    region: 'text',
    state: 'text'
});

module.exports = mongoose.model('Dish', dishSchema); 