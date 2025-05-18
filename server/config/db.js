import mongoose from 'mongoose';

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://khizarjamshaidiqbal:svcpRYdquS1Jxr3r@34.72.160.101:27017/admin';
  
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Starting server without database connection');
    return false;
  }
};

export default connectDB; 