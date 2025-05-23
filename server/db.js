import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/canteen';

// MongoDB connection using mongoose
export const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected using Mongoose');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// MongoDB connection using the native driver (optional, if needed for specific operations)
let client = null;
let db = null;

export const getMongoClient = async () => {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log('MongoDB native client connected');
  }
  return { client, db };
};

// Close connections when the application shuts down
process.on('SIGINT', async () => {
  if (mongoose.connection) {
    await mongoose.connection.close();
    console.log('Mongoose connection closed');
  }
  
  if (client) {
    await client.close();
    console.log('MongoDB client connection closed');
  }
  
  process.exit(0);
});