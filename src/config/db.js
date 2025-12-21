const mongoose = require("mongoose");

const clientOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    // process.exit(1); // Keep alive to see if it retries or just logs
  }
};

module.exports = connectDB;
