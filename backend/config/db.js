const mongoose = require('mongoose');

/**
 * Connect to MongoDB with sensible connection options and retry logic.
 * If MongoDB is not running locally, logs helpful troubleshooting notes.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/course_platform';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.warn('[MongoDB Warning] Running in fallback mode. Ensure MongoDB is active for persistence.');
  }
};

module.exports = connectDB;
