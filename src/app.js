const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const connectDB = require('./config/database');
const dishRoutes = require('./routes/dishRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(`${config.api.prefix}/dishes`, dishRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the Indian Food API',
    version: config.api.version,
    environment: config.nodeEnv
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app; 