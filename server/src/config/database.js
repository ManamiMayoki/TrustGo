const mongoose = require('mongoose');
const env = require('./environment');

let isConnected = false;

const connectDB = async (uri = env.MONGODB_URI) => {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = conn.connections[0].readyState === 1;
    if (!env.isTest) {
      console.log(`[Database] MongoDB connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`[Database] Connection error: ${error.message}`);
    if (!env.isTest) {
      process.exit(1);
    }
    throw error;
  }
};

const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
};

module.exports = { connectDB, disconnectDB };
