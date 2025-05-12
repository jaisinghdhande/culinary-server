const mongoose = require("mongoose");
const config = require("./config");
const importData = require("../scripts/importData");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.db.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Import data after successful connection
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
