require('dotenv').config();
const importData = require('./importData');

// Run the import
importData()
  .then(() => {
    console.log('Data import completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during data import:', error);
    process.exit(1);
  }); 