const authService = require('../services/authService');
const { sendResponse } = require('../utils/apiResponse');
const env = require('../config/environment');

const cookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      
      // Set secure refresh token cookie
      res.cookie('refreshToken', result.refreshToken, cookieOptions);

      return sendResponse(res, 201, 'Account successfully created', {
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.cookie('refreshToken', result.refreshToken, cookieOptions);

      return sendResponse(res, 200, 'Authentication successful', {
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      if (req.user) {
        await authService.logout(req.user._id);
      }
      res.clearCookie('refreshToken', cookieOptions);
      return sendResponse(res, 200, 'Successfully logged out');
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
      const result = await authService.refreshSession(incomingRefreshToken);

      res.cookie('refreshToken', result.refreshToken, cookieOptions);

      return sendResponse(res, 200, 'Session token refreshed', {
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      return sendResponse(res, 200, 'Profile retrieved', {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          accountStatus: req.user.accountStatus,
          emailVerified: req.user.emailVerified,
          createdAt: req.user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      return sendResponse(res, 200, result.message, result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password);
      return sendResponse(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
