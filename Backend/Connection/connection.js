const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://Moketon:Moketon%40123@moketon.sjkfjma.mongodb.net/moketonDB?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI); // No need for deprecated options
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
