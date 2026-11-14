const authService = require('../../src/services/authService');
const { User, Employer, Worker } = require('../../src/models');
const { ROLES } = require('../../src/constants/roles');

describe('AuthService Unit Tests', () => {
  describe('User Registration', () => {
    it('should successfully register a Worker with zero-fee acknowledgement', async () => {
      const payload = {
        name: 'Tareq Hasan',
        email: 'tareq.hasan@example.com',
        password: 'Password123!@#',
        role: ROLES.WORKER,
        workerData: {
          skills: ['Plumbing', 'Pipe Fitting'],
          zeroFeeAffidavitConfirmed: true,
        },
      };

      const result = await authService.register(payload);

      expect(result).toBeDefined();
      expect(result.user.email).toBe(payload.email);
      expect(result.user.role).toBe(ROLES.WORKER);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();

      const workerDoc = await Worker.findOne({ userId: result.user.id });
      expect(workerDoc).toBeDefined();
      expect(workerDoc.zeroFeeDeclarationSigned).toBe(true);
    });

    it('should successfully register an Employer with verification status PENDING', async () => {
      const payload = {
        name: 'Ahmed Al-Sabah',
        email: 'ahmed@alsabah-group.com',
        password: 'Password123!@#',
        role: ROLES.EMPLOYER,
        employerData: {
          companyName: 'Al-Sabah International Engineering',
          registrationNumber: 'KWT-99812-REG',
          country: 'Kuwait',
          city: 'Kuwait City',
          representativeName: 'Ahmed Al-Sabah',
          representativeTitle: 'Managing Director',
          phone: '+965 2200 1100',
          businessEmail: 'ahmed@alsabah-group.com',
        },
      };

      const result = await authService.register(payload);
      expect(result.user.role).toBe(ROLES.EMPLOYER);

      const employerDoc = await Employer.findOne({ userId: result.user.id });
      expect(employerDoc).toBeDefined();
      expect(employerDoc.companyName).toBe(payload.employerData.companyName);
      expect(employerDoc.verificationStatus).toBe('PENDING');
    });

    it('should throw Conflict error if email already exists', async () => {
      const payload = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'Password123!@#',
        role: ROLES.WORKER,
      };

      await authService.register(payload);

      await expect(authService.register(payload)).rejects.toThrow('already exists');
    });
  });

  describe('User Login & Refresh Token Rotation', () => {
    it('should authenticate user and return access + refresh tokens', async () => {
      await authService.register({
        name: 'Login Test',
        email: 'login@example.com',
        password: 'Password123!@#',
        role: ROLES.WORKER,
      });

      const loginResult = await authService.login('login@example.com', 'Password123!@#');
      expect(loginResult.accessToken).toBeDefined();
      expect(loginResult.refreshToken).toBeDefined();
      expect(loginResult.user.email).toBe('login@example.com');
    });

    it('should reject invalid password', async () => {
      await authService.register({
        name: 'Fail Test',
        email: 'fail@example.com',
        password: 'Password123!@#',
        role: ROLES.WORKER,
      });

      await expect(authService.login('fail@example.com', 'WrongPassword123!')).rejects.toThrow(
        'Invalid email or password credentials'
      );
    });

    it('should rotate refresh token and reject reuse of old refresh token', async () => {
      const reg = await authService.register({
        name: 'Rotate Test',
        email: 'rotate@example.com',
        password: 'Password123!@#',
        role: ROLES.WORKER,
      });

      const oldRefreshToken = reg.refreshToken;

      // Rotate token once
      const refreshed = await authService.refreshSession(oldRefreshToken);
      expect(refreshed.accessToken).toBeDefined();
      expect(refreshed.refreshToken).toBeDefined();
      expect(refreshed.refreshToken).not.toBe(oldRefreshToken);

      // Attempting to reuse old token must be detected and rejected
      await expect(authService.refreshSession(oldRefreshToken)).rejects.toThrow('Suspicious activity detected');
    });
  });
});
