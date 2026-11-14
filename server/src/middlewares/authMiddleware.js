const ApiError = require('../utils/apiError');
const { verifyAccessToken } = require('../utils/token');
const { User } = require('../models');
const { ACCOUNT_STATUS } = require('../constants/statuses');

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Fallback: Check Cookies
    else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(ApiError.unauthorized('Authentication required: Missing access token', 'NO_TOKEN'));
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(ApiError.unauthorized('Access token has expired. Please refresh session.', 'TOKEN_EXPIRED'));
      }
      return next(ApiError.unauthorized('Invalid access token', 'INVALID_TOKEN'));
    }

    // Retrieve user
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(ApiError.unauthorized('User associated with this token no longer exists', 'USER_NOT_FOUND'));
    }

    // Verify account status
    if (user.accountStatus === ACCOUNT_STATUS.SUSPENDED) {
      return next(ApiError.forbidden('Your account has been suspended. Please contact compliance support.', 'ACCOUNT_SUSPENDED'));
    }

    if (user.accountStatus === ACCOUNT_STATUS.DEACTIVATED) {
      return next(ApiError.forbidden('Account is deactivated.', 'ACCOUNT_DEACTIVATED'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticate,
};
