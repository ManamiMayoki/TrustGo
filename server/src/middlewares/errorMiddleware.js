const ApiError = require('../utils/apiError');
const env = require('../config/environment');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log error internally
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, err);

  // If not an operational ApiError, normalize it
  if (!(error instanceof ApiError)) {
    // Mongoose Duplicate Key Error (11000)
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue || {})[0] || 'field';
      error = ApiError.conflict(`An account with that ${field} already exists.`, 'DUPLICATE_KEY_ERROR');
    }
    // Mongoose Validation Error
    else if (err.name === 'ValidationError') {
      const details = Object.values(err.errors || {}).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      error = ApiError.badRequest('Database validation failed', details, 'VALIDATION_ERROR');
    }
    // Mongoose CastError (Invalid ObjectId)
    else if (err.name === 'CastError') {
      error = ApiError.badRequest(`Invalid format for parameter: ${err.path}`, [], 'INVALID_ID');
    }
    // JWT Errors
    else if (err.name === 'JsonWebTokenError') {
      error = ApiError.unauthorized('Invalid security authentication token', 'INVALID_TOKEN');
    } else if (err.name === 'TokenExpiredError') {
      error = ApiError.unauthorized('Authentication token has expired. Please refresh session.', 'TOKEN_EXPIRED');
    }
    // Multer Upload Errors
    else if (err.name === 'MulterError') {
      error = ApiError.badRequest(`Upload error: ${err.message}`, [], 'FILE_UPLOAD_ERROR');
    }
    // Generic Uncaught Internal Error
    else {
      const message = env.isProduction ? 'Internal Server Error' : err.message;
      error = ApiError.internal(message);
    }
  }

  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: error.message || 'Request failed',
    error: {
      code: error.code || 'INTERNAL_ERROR',
      details: error.details || [],
    },
  };

  // Stack trace only visible in development
  if (!env.isProduction) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// 404 Route Not Found Handler
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Endpoint not found: ${req.method} ${req.originalUrl}`));
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
