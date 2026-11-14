const mongoose = require('mongoose');
const crypto = require('crypto');
const escrowService = require('../../src/services/escrowService');
const { EscrowMilestone, User, Employer, Worker, WorkerApplication, VerifiedJob } = require('../../src/models');
const { ESCROW_MILESTONES, MILESTONE_STATUS, ESCROW_RELEASE_STATUS } = require('../../src/constants/statuses');

describe('EscrowService Unit Tests', () => {
  let adminUser, employer, worker, application, escrow;

  beforeEach(async () => {
    adminUser = await User.create({
      name: 'Admin Verifier',
      email: 'verifier@trustgo.com',
      passwordHash: 'dummy_hash',
      role: 'ADMIN',
    });

    const employerUser = await User.create({
      name: 'Employer User',
      email: 'employer@contracting.com',
      passwordHash: 'dummy_hash',
      role: 'EMPLOYER',
    });

    employer = await Employer.create({
      userId: employerUser._id,
      companyName: 'Apex Gulf Contracting LLC',
      registrationNumber: 'APEX-9921',
      country: 'UAE',
      address: { city: 'Dubai' },
      representative: {
        name: 'Apex Manager',
        title: 'HR Director',
        phone: '+971 4 000 0000',
        email: 'apex@contracting.com',
      },
      businessEmail: 'apex@contracting.com',
      verificationStatus: 'VERIFIED',
    });

    const workerUser = await User.create({
      name: 'Kamal Hossain',
      email: 'kamal@worker.com',
      passwordHash: 'dummy_hash',
      role: 'WORKER',
    });

    worker = await Worker.create({
      userId: workerUser._id,
      skills: ['Masonry'],
      zeroFeeDeclarationSigned: true,
    });

    const job = await VerifiedJob.create({
      employerId: employer._id,
      title: 'Structural Mason',
      description: 'Masonry work in Dubai with zero recruitment fees.',
      country: 'UAE',
      city: 'Dubai',
      industry: 'Construction',
      salary: { base: 1200 },
      overtimePolicy: 'Standard 1.25x',
      housingTerms: 'Provided',
      medicalTerms: 'Covered',
      workingHours: 48,
      weeklyHolidays: 1,
      contractDuration: '2 Years',
      visaRequirements: 'Work visa provided',
      zeroWorkerFeeGuarantee: true,
    });

    application = await WorkerApplication.create({
      workerId: worker._id,
      jobId: job._id,
      employerId: employer._id,
      applicationStatus: 'CONTRACT_SIGNED',
    });

    const totalAmount = 2400; // Simulated employer escrow deposit
    escrow = await EscrowMilestone.create({
      applicationId: application._id,
      employerId: employer._id,
      workerId: worker._id,
      totalContractualAmount: totalAmount,
      currency: 'USD',
      idempotencyKey: crypto.randomUUID(),
      transactionReference: 'TX-TEST-' + crypto.randomBytes(4).toString('hex'),
      releaseStatus: ESCROW_RELEASE_STATUS.HELD_IN_ESCROW,
      milestones: [
        {
          milestoneType: ESCROW_MILESTONES.VISA_VERIFIED,
          percentage: 30,
          allocatedAmount: 720,
          status: MILESTONE_STATUS.LOCKED,
        },
        {
          milestoneType: ESCROW_MILESTONES.SAFE_ARRIVAL_PASSPORT_CONFIRMED,
          percentage: 30,
          allocatedAmount: 720,
          status: MILESTONE_STATUS.LOCKED,
        },
        {
          milestoneType: ESCROW_MILESTONES.DAY_30_WELFARE_CHECKIN,
          percentage: 40,
          allocatedAmount: 960,
          status: MILESTONE_STATUS.LOCKED,
        },
      ],
    });
  });

  it('should verify and release Milestone 1 (Visa Verified - 30%)', async () => {
    const updated = await escrowService.verifyAndReleaseMilestone(
      escrow._id,
      ESCROW_MILESTONES.VISA_VERIFIED,
      adminUser._id,
      'Visa approved'
    );

    const m1 = updated.milestones.find((m) => m.milestoneType === ESCROW_MILESTONES.VISA_VERIFIED);
    expect(m1.status).toBe(MILESTONE_STATUS.RELEASED);
    expect(m1.releaseTransactionHash).toBeDefined();
    expect(updated.releaseStatus).toBe(ESCROW_RELEASE_STATUS.PARTIALLY_RELEASED);
  });

  it('should prevent double release of the same milestone', async () => {
    await escrowService.verifyAndReleaseMilestone(
      escrow._id,
      ESCROW_MILESTONES.VISA_VERIFIED,
      adminUser._id
    );

    await expect(
      escrowService.verifyAndReleaseMilestone(escrow._id, ESCROW_MILESTONES.VISA_VERIFIED, adminUser._id)
    ).rejects.toThrow('already been verified and released');
  });

  it('should enforce sequential progression: cannot release Milestone 2 without Milestone 1', async () => {
    await expect(
      escrowService.verifyAndReleaseMilestone(
        escrow._id,
        ESCROW_MILESTONES.SAFE_ARRIVAL_PASSPORT_CONFIRMED,
        adminUser._id
      )
    ).rejects.toThrow('Milestone 1 (Visa Verified) must be released');
  });

  it('should record Day-30 Bengali voice welfare check-in and mark eligible', async () => {
    const updated = await escrowService.recordDay30CheckIn(escrow._id, worker.userId, {
      passportInPossession: true,
      salaryPaidAsContracted: true,
      safeAccommodations: true,
      bengaliTranscript: 'আমি নিরাপদে আছি। আমার পাসপোর্ট আমার কাছে আছে।',
    });

    const m3 = updated.milestones.find((m) => m.milestoneType === ESCROW_MILESTONES.DAY_30_WELFARE_CHECKIN);
    expect(m3.status).toBe(MILESTONE_STATUS.ELIGIBLE);
    expect(m3.welfareCheckInData.workerReportedCondition.passportInPossession).toBe(true);
    expect(m3.welfareCheckInData.welfareScore).toBe(10);
  });
});
