const request = require('supertest');
const app = require('../../src/app');
const { User, Employer, Worker, VerifiedJob, WorkerApplication, EscrowMilestone, ContractAudit } = require('../../src/models');
const { ROLES } = require('../../src/constants/roles');
const { EMPLOYER_VERIFICATION_STATUS, ESCROW_MILESTONES, MILESTONE_STATUS } = require('../../src/constants/statuses');
const { generateAccessToken } = require('../../src/utils/token');

describe('Full-Stack End-to-End Recruitment Lifecycle Workflow', () => {
  it('should execute the complete 10-step ethical recruitment lifecycle', async () => {
    // Step 0: Create Platform Admin
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin_workflow@trustgo.com',
      passwordHash: 'dummy_hash',
      role: ROLES.ADMIN,
      emailVerified: true,
    });
    const adminToken = generateAccessToken(admin);

    // Step 1: Employer registers
    const regEmpRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Gulf Infra Director',
        email: 'employer_workflow@gulfinfra.ae',
        password: 'Password123!@#',
        role: ROLES.EMPLOYER,
        employerData: {
          companyName: 'Gulf Infrastructure Contracting LLC',
          registrationNumber: 'DXB-INFRA-9921',
          country: 'United Arab Emirates',
          city: 'Dubai',
          representativeName: 'Gulf Infra Director',
          representativeTitle: 'HR Director',
          phone: '+971 4 999 8888',
          businessEmail: 'employer_workflow@gulfinfra.ae',
        },
      });

    expect(regEmpRes.status).toBe(201);
    const employerToken = regEmpRes.body.data.accessToken;
    const employerDoc = await Employer.findOne({ userId: regEmpRes.body.data.user.id });
    expect(employerDoc.verificationStatus).toBe(EMPLOYER_VERIFICATION_STATUS.PENDING);
    const employerId = employerDoc._id;

    // Step 2 & 3: Admin verifies employer
    const verifyEmpRes = await request(app)
      .patch(`/api/v1/employers/${employerId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: EMPLOYER_VERIFICATION_STATUS.VERIFIED });

    expect(verifyEmpRes.status).toBe(200);
    expect(verifyEmpRes.body.data.verificationStatus).toBe(EMPLOYER_VERIFICATION_STATUS.VERIFIED);

    // Step 4: Verified Employer creates a transparent job listing with zero-fee guarantee
    const jobRes = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${employerToken}`)
      .send({
        title: 'Master Electrical Technician',
        description: 'Electrical grid wiring in Dubai with zero recruitment fees charged to candidates.',
        country: 'United Arab Emirates',
        city: 'Dubai',
        industry: 'Construction & Energy',
        requiredSkills: ['High Voltage Wiring', 'Safety'],
        vacancies: 5,
        salary: { base: 1500 },
        currency: 'USD',
        overtimePolicy: '1.25x standard hourly rate',
        housingTerms: 'Furnished accommodation and utilities provided free of charge',
        medicalTerms: 'Full medical insurance coverage',
        workingHours: 48,
        weeklyHolidays: 1,
        contractDuration: '2 Years',
        visaRequirements: 'Work visa provided free by employer',
        zeroWorkerFeeGuarantee: true,
      });

    expect(jobRes.status).toBe(201);
    const jobId = jobRes.body.data._id;

    // Step 5: Worker registers with mandatory zero-fee affidavit
    const regWorkerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Jamil Ahmed',
        email: 'jamil.ahmed@example.com',
        password: 'Password123!@#',
        role: ROLES.WORKER,
        workerData: {
          skills: ['Electrical Wiring', 'Blueprints'],
          zeroFeeAffidavitConfirmed: true,
        },
      });

    expect(regWorkerRes.status).toBe(201);
    const workerToken = regWorkerRes.body.data.accessToken;

    // Step 6: Worker applies for verified job (Initializes Escrow & Audit)
    const applyRes = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${workerToken}`)
      .send({ jobId });

    expect(applyRes.status).toBe(201);
    const applicationId = applyRes.body.data._id;

    // Verify Escrow and Audit documents were initialized
    const escrowDoc = await EscrowMilestone.findOne({ applicationId });
    expect(escrowDoc).toBeDefined();
    expect(escrowDoc.milestones.length).toBe(3);
    const escrowId = escrowDoc._id;

    const auditDoc = await ContractAudit.findOne({ applicationId });
    expect(auditDoc).toBeDefined();
    expect(auditDoc.complianceScore).toBe(100);
    const auditId = auditDoc._id;

    // Step 7: Employer reviews application and signs contract
    const contractRes = await request(app)
      .patch(`/api/v1/applications/${applicationId}/status`)
      .set('Authorization', `Bearer ${employerToken}`)
      .send({ status: 'CONTRACT_SIGNED' });

    expect(contractRes.status).toBe(200);

    // Step 8: Admin authorizes Milestone 1 (Visa Verified - 30%)
    const m1Res = await request(app)
      .patch(`/api/v1/escrow/${escrowId}/verify-milestone`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        milestoneType: ESCROW_MILESTONES.VISA_VERIFIED,
        notes: 'Residency visa verified via embassy portal',
      });

    expect(m1Res.status).toBe(200);
    const m1 = m1Res.body.data.milestones.find((m) => m.milestoneType === ESCROW_MILESTONES.VISA_VERIFIED);
    expect(m1.status).toBe(MILESTONE_STATUS.RELEASED);

    // Step 8b: Admin authorizes Milestone 2 (Safe Arrival & Passport Confirmed - 30%)
    const m2Res = await request(app)
      .patch(`/api/v1/escrow/${escrowId}/verify-milestone`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        milestoneType: ESCROW_MILESTONES.SAFE_ARRIVAL_PASSPORT_CONFIRMED,
        notes: 'Flight arrival verified; worker confirms physical custody of passport',
      });

    expect(m2Res.status).toBe(200);
    const m2 = m2Res.body.data.milestones.find((m) => m.milestoneType === ESCROW_MILESTONES.SAFE_ARRIVAL_PASSPORT_CONFIRMED);
    expect(m2.status).toBe(MILESTONE_STATUS.RELEASED);

    // Step 9: Worker records Day-30 voluntary Bengali voice check-in
    const checkInRes = await request(app)
      .post(`/api/v1/escrow/${escrowId}/day-30-checkin`)
      .set('Authorization', `Bearer ${workerToken}`)
      .send({
        voiceNoteUrl: 'https://assets.trustgo.com/audio/test_voice_note.mp3',
        bengaliTranscript: 'আমি দুবাইতে নিরাপদে আছি। বেতন পেয়েছি, পাসপোর্ট আমার কাছে আছে।',
        passportInPossession: true,
        salaryPaidAsContracted: true,
        safeAccommodations: true,
      });

    expect(checkInRes.status).toBe(200);
    const m3 = checkInRes.body.data.milestones.find((m) => m.milestoneType === ESCROW_MILESTONES.DAY_30_WELFARE_CHECKIN);
    expect(m3.status).toBe(MILESTONE_STATUS.ELIGIBLE);
    expect(m3.welfareCheckInData.workerReportedCondition.passportInPossession).toBe(true);

    // Step 10: Compliance Audit PDF is downloadable with valid headers
    const pdfRes = await request(app)
      .get(`/api/v1/compliance/reports/${auditId}/pdf`)
      .set('Authorization', `Bearer ${workerToken}`);

    expect(pdfRes.status).toBe(200);
    expect(pdfRes.headers['content-type']).toBe('application/pdf');
    expect(pdfRes.headers['content-disposition']).toContain('attachment');
  });
});
