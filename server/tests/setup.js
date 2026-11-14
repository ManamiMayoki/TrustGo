const mongoose = require('mongoose');

beforeAll(async () => {
  // Set test environment secrets
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = 'test_jwt_access_secret_super_secure_32chars!';
  process.env.JWT_REFRESH_SECRET = 'test_jwt_refresh_secret_super_secure_32chars!';
  process.env.COOKIE_SECRET = 'test_cookie_secret_super_secure_32chars!';

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27018/trustgo_test_suite';

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
  } catch (err) {
    // If local port 27018 is not reachable, fallback to MongoMemoryServer
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
    await mongoose.disconnect();
  }
});

afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
  }
});
