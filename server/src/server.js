const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const env = require('./config/environment');
const { connectDB, disconnectDB } = require('./config/database');
const logger = require('./utils/logger');

const server = http.createServer(app);

// Realtime WebSockets for Dashboard Events
const io = new Server(server, {
  cors: {
    origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  logger.info(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    logger.info(`[Socket.IO] Client ${socket.id} joined user_${userId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Attach socket instance to app for service-level emits
app.set('io', io);

// Start Server Function
const startServer = async () => {
  try {
    await connectDB();

    server.listen(env.PORT, () => {
      logger.info(`[Server] TrustGo API server running on port ${env.PORT} (${env.NODE_ENV})`);
      logger.info(`[Server] API Base: http://localhost:${env.PORT}/api/v1`);
      logger.info(`[Server] Health Probe: http://localhost:${env.PORT}/api/v1/health`);
    });
  } catch (error) {
    logger.error('[Server] Fatal startup error', error);
    process.exit(1);
  }
};

// Graceful Shutdown
const handleShutdown = async (signal) => {
  logger.info(`[Server] Received ${signal}. Initiating graceful shutdown...`);
  server.close(async () => {
    logger.info('[Server] HTTP server closed.');
    await disconnectDB();
    logger.info('[Server] Database connections closed. Process terminating.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { app, server, io };
