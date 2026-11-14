const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const ApiError = require('../utils/apiError');
const { User, Employer, Worker } = require('../models');
const { ROLES } = require('../constants/roles');
const {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} = require('../utils/token');

class AuthService {
  /**
   * Register a new user (Worker or Employer)
   */
  async register({ name, email, password, role, employerData, workerData }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('An account with this email address already exists');
    }

    // Salt and hash password (Work factor 12)
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      passwordHash,
      role,
    });

    await user.save();

    // Create associated profile based on role
    if (role === ROLES.EMPLOYER && employerData) {
      const employer = new Employer({
        userId: user._id,
        companyName: employerData.companyName,
        registrationNumber: employerData.registrationNumber,
        country: employerData.country,
        address: {
          city: employerData.city,
        },
        representative: {
          name: employerData.representativeName,
          title: employerData.representativeTitle,
          phone: employerData.phone,
          email: employerData.businessEmail,
        },
        businessEmail: employerData.businessEmail,
        website: employerData.website,
      });
      await employer.save();
    } else if (role === ROLES.WORKER) {
      const worker = new Worker({
        userId: user._id,
        skills: workerData?.skills || [],
        zeroFeeDeclarationSigned: true,
      });
      await worker.save();
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Authenticate user with email and password
   */
  async login(email, password) {
    const user = await User.findOne({ email }).select('+passwordHash +refreshTokenHash');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password credentials');
    }

    // Check account lockout
    if (user.isLocked()) {
      throw ApiError.forbidden(
        'Account is temporarily locked due to excessive failed login attempts. Please try again after 15 minutes.'
      );
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lock
      }
      await user.save();
      throw ApiError.unauthorized('Invalid email or password credentials');
    }

    // Reset failed login attempts on successful authentication
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Rotate Refresh Token and return new Access & Refresh tokens
   */
  async refreshSession(incomingRefreshToken) {
    if (!incomingRefreshToken) {
      throw ApiError.unauthorized('Refresh token is required');
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(incomingRefreshToken);
    } catch (err) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id).select('+refreshTokenHash');
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    const incomingHash = hashToken(incomingRefreshToken);

    // Reuse detection: If token hash does not match current active hash, someone might have stolen it
    if (user.refreshTokenHash !== incomingHash) {
      // Invalidate all tokens for security
      user.refreshTokenHash = undefined;
      await user.save();
      throw ApiError.unauthorized('Suspicious activity detected: Refresh token reuse. Session terminated.');
    }

    // Issue rotated tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshTokenHash = hashToken(newRefreshToken);
    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout user by invalidating refresh token hash
   */
  async logout(userId) {
    await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
    return true;
  }

  /**
   * Generate short-lived password reset token
   */
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Return generic message to prevent email enumeration
      return { message: 'If an account exists with that email, a password reset link has been dispatched.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = hashToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    // In a production setup, emailService.sendPasswordReset(user.email, resetToken) would run
    return {
      message: 'If an account exists with that email, a password reset link has been dispatched.',
      simulatedToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
    };
  }

  /**
   * Reset password with valid token
   */
  async resetPassword(token, newPassword) {
    const hashedToken = hashToken(token);
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      throw ApiError.badRequest('Password reset token is invalid or has expired');
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    return { message: 'Password has been successfully updated.' };
  }
}

module.exports = new AuthService();
