const request = require('supertest');
const app = require('../../src/app');
const { User, Employer, VerifiedJob } = require('../../src/models');
const { generateAccessToken } = require('../../src/utils/token');
const { ROLES } = require('../../src/constants/roles');

describe('Dedicated Cybersecurity & OWASP Test Suite', () => {
  let workerUser, workerToken, employerUser, employerToken, adminUser, adminToken;

  beforeEach(async () => {
    workerUser = await User.create({
      name: 'Security Test Worker',
      email: 'sec_worker@test.com',
      passwordHash: 'dummy_hash',
      role: ROLES.WORKER,
    });
    workerToken = generateAccessToken(workerUser);

    employerUser = await User.create({
      name: 'Security Test Employer',
      email: 'sec_employer@test.com',
      passwordHash: 'dummy_hash',
      role: ROLES.EMPLOYER,
    });
    await Employer.create({
      userId: employerUser._id,
      companyName: 'Company A LLC',
      registrationNumber: 'REG-A-001',
      country: 'UAE',
      address: { city: 'Dubai' },
      representative: {
        name: 'Manager A',
        title: 'Director',
        phone: '+971 4 111 2222',
        email: 'corp_a@test.com',
      },
      businessEmail: 'corp_a@test.com',
      verificationStatus: 'VERIFIED',
    });
    employerToken = generateAccessToken(employerUser);

    adminUser = await User.create({
      name: 'Security Test Admin',
      email: 'sec_admin@test.com',
      passwordHash: 'dummy_hash',
      role: ROLES.ADMIN,
    });
    adminToken = generateAccessToken(adminUser);
  });

  describe('1. NoSQL Injection Defenses', () => {
    it('should sanitize or reject MongoDB operator payloads ($gt, $ne) in login', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: { $gt: '' },
          password: { $gt: '' },
        });

      // Must fail validation or return 400 Bad Request
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should strip MongoDB operator keys from request queries', async () => {
      const res = await request(app)
        .get('/api/v1/jobs?status[$ne]=PUBLISHED')
        .set('Authorization', `Bearer ${workerToken}`);

      // Query sanitizer should strip unauthorized operators
      expect(res.status).toBe(200);
    });
  });

  describe('2. Authentication Defenses', () => {
    it('should reject access to protected endpoints without token (HTTP 401)', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NO_TOKEN');
    });

    it('should reject forged or corrupted JWT tokens', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer forged.jwt.token.signature');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('3. Broken Object Level Authorization (BOLA/IDOR) & RBAC', () => {
    it('should prevent Worker from accessing Admin dashboard (HTTP 403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${workerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should prevent Employer A from updating Employer B job listing', async () => {
      const otherEmployer = await Employer.create({
        userId: new (require('mongoose').Types.ObjectId)(),
        companyName: 'Company B',
        registrationNumber: 'REG-B-991',
        country: 'Saudi Arabia',
        address: { city: 'Riyadh' },
        representative: {
          name: 'Manager B',
          title: 'Director',
          phone: '+966 1 000 0000',
          email: 'corp_b@test.com',
        },
        businessEmail: 'corp_b@test.com',
        verificationStatus: 'VERIFIED',
      });

      const otherJob = await VerifiedJob.create({
        employerId: otherEmployer._id,
        title: 'Job B',
        description: 'Description B for job posting',
        country: 'Saudi Arabia',
        city: 'Riyadh',
        industry: 'Construction',
        salary: { base: 1500 },
        overtimePolicy: 'Standard',
        housingTerms: 'Standard',
        medicalTerms: 'Standard',
        contractDuration: '2 Years',
        visaRequirements: 'Standard',
      });

      const res = await request(app)
        .put(`/api/v1/jobs/${otherJob._id}`)
        .set('Authorization', `Bearer ${employerToken}`)
        .send({ title: 'Malicious Hijacked Job Title' });

      // Should be rejected by ownership middleware
      expect([403, 404]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });
  });

  describe('4. HTTP Security Headers (Helmet)', () => {
    it('should include critical OWASP security headers', async () => {
      const res = await request(app).get('/api/v1/health');

      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(res.headers['content-security-policy']).toBeDefined();
    });
  });

  describe('5. Password Strength Validation', () => {
    it('should reject weak password during registration', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Weak Password User',
          email: 'weak@example.com',
          password: 'password', // Missing uppercase, number, symbol, min 8
          role: ROLES.WORKER,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
