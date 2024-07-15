require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb+srv://hirenngood:RKOz410y20B1fmuH@wisdomwise.langpsw.mongodb.net/?retryWrites=true&w=majority&appName=wisdomwise';

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // ssl: true, // Enable this if SSL is required for your connection
    });
    console.log("Connected to MongoDB with Mongoose");

  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

connectToDatabase();

module.exports = mongoose;
