import mongoose from 'mongoose';

// Middleware to check if database is connected
const dbConnectionCheck = (req, res, next) => {
  // If mongoose is not connected, return 503 Service Unavailable
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database connection unavailable'
    });
  }
  
  next();
};

export default dbConnectionCheck; 