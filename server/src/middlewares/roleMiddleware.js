const ApiError = require('../utils/apiError');
const { ROLES } = require('../constants/roles');

/**
 * Role-Based Access Control (RBAC) Middleware
 * @param  {...string} allowedRoles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('User not authenticated'));
    }

    // Super Admin has universal access
    if (req.user.role === ROLES.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access forbidden: Role '${req.user.role}' is not authorized to access this resource`,
          'FORBIDDEN_ROLE'
        )
      );
    }

    next();
  };
};

module.exports = {
  authorize,
};
