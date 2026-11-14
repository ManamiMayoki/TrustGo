const { Worker, WorkerApplication, AuditLog } = require('../models');
const ApiError = require('../utils/apiError');

class WorkerService {
  async getProfile(userId) {
    const worker = await Worker.findOne({ userId }).populate('userId', 'name email role accountStatus emailVerified');
    if (!worker) {
      throw ApiError.notFound('Worker profile not found');
    }
    return worker;
  }

  async updateProfile(userId, updateData) {
    const worker = await Worker.findOne({ userId });
    if (!worker) {
      throw ApiError.notFound('Worker profile not found');
    }

    // Protect sensitive verification fields
    delete updateData.TTCVerification;
    delete updateData.identityVerificationStatus;
    delete updateData.userId;

    Object.assign(worker, updateData);
    await worker.save();
    return worker;
  }

  async submitTTCVerification(userId, { certificateNumber, centerName }) {
    const worker = await Worker.findOne({ userId });
    if (!worker) {
      throw ApiError.notFound('Worker profile not found');
    }

    worker.TTCVerification = {
      isVerified: true, // Simulation of BMET/TTC database API verification
      certificateNumber,
      centerName: centerName || 'Technical Training Center (TTC) Dhaka, BMET',
      verifiedAt: new Date(),
    };
    worker.identityVerificationStatus = 'VERIFIED';
    await worker.save();

    await AuditLog.create({
      userId,
      action: 'TTC_VERIFICATION_SUBMITTED',
      resourceType: 'WORKER',
      resourceId: worker._id.toString(),
      metadata: { centerName },
    });

    return worker;
  }

  async getApplications(userId) {
    const worker = await Worker.findOne({ userId });
    if (!worker) {
      throw ApiError.notFound('Worker profile not found');
    }

    const applications = await WorkerApplication.find({ workerId: worker._id })
      .populate({
        path: 'jobId',
        select: 'title country city industry salary currency overtimePolicy housingTerms medicalTerms status',
        populate: {
          path: 'employerId',
          select: 'companyName country representative verificationStatus esgRating',
        },
      })
      .sort({ createdAt: -1 });

    return applications;
  }

  /**
   * Employers viewing worker profile: STRICT PII REDACTION
   * Per Section 7: "Do not expose biometric templates, government identity numbers,
   * or sensitive verification records to employers. Show only necessary verification outcomes
   * and authorized information."
   */
  async getWorkerForEmployer(id) {
    const worker = await Worker.findById(id).populate('userId', 'name');
    if (!worker) {
      throw ApiError.notFound('Candidate record not found');
    }

    return {
      id: worker._id,
      name: worker.userId?.name || 'Verified Bangladeshi Candidate',
      skills: worker.skills,
      education: worker.education,
      experience: worker.experience,
      certifications: worker.certifications,
      languageSkills: worker.languageSkills,
      TTCVerificationStatus: worker.TTCVerification.isVerified ? 'VERIFIED' : 'UNVERIFIED',
      trainingCenter: worker.TTCVerification.centerName,
      identityStatus: worker.identityVerificationStatus,
      zeroFeeAffidavitConfirmed: worker.zeroFeeDeclarationSigned,
    };
  }
}

module.exports = new WorkerService();
