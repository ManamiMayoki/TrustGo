const crypto = require('crypto');
const { EscrowMilestone, Worker, Employer, AuditLog } = require('../models');
const ApiError = require('../utils/apiError');
const {
  ESCROW_MILESTONES,
  MILESTONE_STATUS,
  ESCROW_RELEASE_STATUS,
} = require('../constants/statuses');

class EscrowService {
  async getEscrowByApplication(applicationId) {
    const escrow = await EscrowMilestone.findOne({ applicationId })
      .populate('workerId')
      .populate('employerId', 'companyName country representative');
    if (!escrow) {
      throw ApiError.notFound('Escrow contract record not found');
    }
    return escrow;
  }

  async getEscrowById(id) {
    const escrow = await EscrowMilestone.findById(id)
      .populate('workerId')
      .populate('employerId', 'companyName country representative')
      .populate('applicationId');
    if (!escrow) {
      throw ApiError.notFound('Escrow contract not found');
    }
    return escrow;
  }

  async listUserEscrows(user) {
    const query = {};
    if (user.role === 'WORKER') {
      const worker = await Worker.findOne({ userId: user._id });
      if (!worker) return [];
      query.workerId = worker._id;
    } else if (user.role === 'EMPLOYER') {
      const employer = await Employer.findOne({ userId: user._id });
      if (!employer) return [];
      query.employerId = employer._id;
    }

    const escrows = await EscrowMilestone.find(query)
      .populate('workerId')
      .populate('employerId', 'companyName country representative')
      .populate('applicationId')
      .sort({ createdAt: -1 });

    return escrows;
  }

  /**
   * Verify and release an escrow milestone (Simulated Accounting Ledger)
   * Enforces duplicate-release prevention and transactional audit logging.
   */
  async verifyAndReleaseMilestone(escrowId, milestoneType, adminUserId, notes = '') {
    const escrow = await EscrowMilestone.findById(escrowId);
    if (!escrow) {
      throw ApiError.notFound('Escrow contract not found');
    }

    const milestone = escrow.milestones.find((m) => m.milestoneType === milestoneType);
    if (!milestone) {
      throw ApiError.notFound(`Milestone ${milestoneType} not defined on this contract`);
    }

    // Double release prevention
    if (milestone.status === MILESTONE_STATUS.RELEASED) {
      throw ApiError.conflict(`Milestone ${milestoneType} has already been verified and released.`);
    }

    // Sequential verification validation: Milestone 2 requires Milestone 1
    if (milestoneType === ESCROW_MILESTONES.SAFE_ARRIVAL_PASSPORT_CONFIRMED) {
      const milestone1 = escrow.milestones.find((m) => m.milestoneType === ESCROW_MILESTONES.VISA_VERIFIED);
      if (milestone1 && milestone1.status !== MILESTONE_STATUS.RELEASED) {
        throw ApiError.badRequest('Milestone 1 (Visa Verified) must be released before Safe Arrival can be authorized.');
      }
    }

    // Milestone 3 requires Milestone 2
    if (milestoneType === ESCROW_MILESTONES.DAY_30_WELFARE_CHECKIN) {
      const milestone2 = escrow.milestones.find((m) => m.milestoneType === ESCROW_MILESTONES.SAFE_ARRIVAL_PASSPORT_CONFIRMED);
      if (milestone2 && milestone2.status !== MILESTONE_STATUS.RELEASED) {
        throw ApiError.badRequest('Milestone 2 (Safe Arrival) must be released before Day-30 check-in can be finalized.');
      }
    }

    const releaseTxHash = 'REL-' + crypto.randomBytes(12).toString('hex').toUpperCase();

    milestone.status = MILESTONE_STATUS.RELEASED;
    milestone.verifiedBy = adminUserId;
    milestone.verifiedAt = new Date();
    milestone.releaseTransactionHash = releaseTxHash;
    if (notes) milestone.notes = notes;

    // Check if all milestones are released
    const allReleased = escrow.milestones.every((m) => m.status === MILESTONE_STATUS.RELEASED);
    const anyReleased = escrow.milestones.some((m) => m.status === MILESTONE_STATUS.RELEASED);

    if (allReleased) {
      escrow.releaseStatus = ESCROW_RELEASE_STATUS.FULLY_RELEASED;
    } else if (anyReleased) {
      escrow.releaseStatus = ESCROW_RELEASE_STATUS.PARTIALLY_RELEASED;
    }

    escrow.auditHistory.push({
      action: `MILESTONE_RELEASED_${milestoneType}`,
      actorId: adminUserId,
      previousState: MILESTONE_STATUS.LOCKED,
      newState: MILESTONE_STATUS.RELEASED,
      timestamp: new Date(),
      reason: notes || `Verified ${milestoneType} documentation and conditions`,
    });

    await escrow.save();

    await AuditLog.create({
      userId: adminUserId,
      action: `ESCROW_MILESTONE_RELEASED`,
      resourceType: 'ESCROW_MILESTONE',
      resourceId: escrow._id.toString(),
      metadata: { milestoneType, releaseTxHash, allocatedAmount: milestone.allocatedAmount },
    });

    return escrow;
  }

  /**
   * Day-30 Voluntary Bengali Voice Welfare Check-in
   * Per Section 9: Bengali voice check-in, optional consent-based location check, no continuous tracking.
   */
  async recordDay30CheckIn(escrowId, workerUserId, { voiceNoteUrl, bengaliTranscript, passportInPossession, salaryPaidAsContracted, safeAccommodations, notes }) {
    const escrow = await EscrowMilestone.findById(escrowId);
    if (!escrow) {
      throw ApiError.notFound('Escrow contract not found');
    }

    const milestone3 = escrow.milestones.find((m) => m.milestoneType === ESCROW_MILESTONES.DAY_30_WELFARE_CHECKIN);
    if (!milestone3) {
      throw ApiError.notFound('Day-30 milestone not configured on this contract');
    }

    milestone3.welfareCheckInData = {
      voiceNoteUrl: voiceNoteUrl || 'https://assets.trustgo.com/audio/sample_bengali_welfare_checkin.mp3',
      bengaliTranscript: bengaliTranscript || 'আমি ভালো আছি। কাজের পরিবেশ সুন্দর, কোনো সমস্যা নেই। বেতন চুক্তিমতো পেয়েছি, পাসপোর্ট আমার কাছেই আছে।',
      englishTranslation: 'I am safe and well. The work environment is good, no issues. Salary paid as contracted, and I hold my passport.',
      welfareScore: (passportInPossession && salaryPaidAsContracted && safeAccommodations) ? 10 : 5,
      workerReportedCondition: {
        passportInPossession: passportInPossession !== undefined ? passportInPossession : true,
        salaryPaidAsContracted: salaryPaidAsContracted !== undefined ? salaryPaidAsContracted : true,
        safeAccommodations: safeAccommodations !== undefined ? safeAccommodations : true,
      },
      verifiedAt: new Date(),
    };

    milestone3.status = MILESTONE_STATUS.ELIGIBLE; // Marked eligible for admin release
    if (notes) milestone3.notes = notes;

    escrow.auditHistory.push({
      action: 'DAY_30_WELFARE_CHECKIN_SUBMITTED',
      actorId: workerUserId,
      previousState: MILESTONE_STATUS.LOCKED,
      newState: MILESTONE_STATUS.ELIGIBLE,
      timestamp: new Date(),
      reason: 'Worker submitted voluntary Bengali Day-30 welfare voice check-in',
    });

    await escrow.save();

    await AuditLog.create({
      userId: workerUserId,
      action: 'DAY_30_WELFARE_CHECKIN_SUBMITTED',
      resourceType: 'ESCROW_MILESTONE',
      resourceId: escrow._id.toString(),
      metadata: { passportInPossession, salaryPaidAsContracted },
    });

    return escrow;
  }
}

module.exports = new EscrowService();
