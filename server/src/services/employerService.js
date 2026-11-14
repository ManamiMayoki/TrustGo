const { Employer, User, AuditLog } = require('../models');
const ApiError = require('../utils/apiError');
const { EMPLOYER_VERIFICATION_STATUS } = require('../constants/statuses');

class EmployerService {
  async getProfile(userId) {
    const employer = await Employer.findOne({ userId }).populate('userId', 'name email role accountStatus');
    if (!employer) {
      throw ApiError.notFound('Employer profile not found');
    }
    return employer;
  }

  async updateProfile(userId, updateData) {
    const employer = await Employer.findOne({ userId });
    if (!employer) {
      throw ApiError.notFound('Employer profile not found');
    }

    // Protected fields that cannot be altered directly
    delete updateData.verificationStatus;
    delete updateData.verifiedAt;
    delete updateData.verifiedBy;
    delete updateData.userId;

    Object.assign(employer, updateData);
    await employer.save();
    return employer;
  }

  async submitVerification(userId, documents) {
    const employer = await Employer.findOne({ userId });
    if (!employer) {
      throw ApiError.notFound('Employer profile not found');
    }

    if (Array.isArray(documents) && documents.length > 0) {
      employer.verificationDocuments.push(...documents);
    }
    employer.verificationStatus = EMPLOYER_VERIFICATION_STATUS.UNDER_REVIEW;
    await employer.save();

    await AuditLog.create({
      userId,
      action: 'EMPLOYER_VERIFICATION_SUBMITTED',
      resourceType: 'EMPLOYER',
      resourceId: employer._id.toString(),
      metadata: { documentCount: documents.length },
    });

    return employer;
  }

  async listEmployers({ page = 1, limit = 20, status, country, search }) {
    const query = {};
    if (status) query.verificationStatus = status;
    if (country) query.country = new RegExp(country, 'i');
    if (search) {
      query.$or = [
        { companyName: new RegExp(search, 'i') },
        { registrationNumber: new RegExp(search, 'i') },
      ];
    }

    const skip = (page - 1) * limit;
    const [employers, total] = await Promise.all([
      Employer.find(query).populate('userId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Employer.countDocuments(query),
    ]);

    return {
      employers,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEmployerById(id) {
    const employer = await Employer.findById(id).populate('userId', 'name email');
    if (!employer) {
      throw ApiError.notFound('Employer not found');
    }
    return employer;
  }

  async updateStatus(id, status, rejectionReason, adminUserId) {
    const employer = await Employer.findById(id);
    if (!employer) {
      throw ApiError.notFound('Employer not found');
    }

    const previousStatus = employer.verificationStatus;
    employer.verificationStatus = status;
    if (status === EMPLOYER_VERIFICATION_STATUS.VERIFIED) {
      employer.verifiedAt = new Date();
      employer.verifiedBy = adminUserId;
      employer.rejectionReason = undefined;
    } else if (status === EMPLOYER_VERIFICATION_STATUS.REJECTED) {
      employer.rejectionReason = rejectionReason || 'Documentation failed verification checks';
    }

    await employer.save();

    await AuditLog.create({
      userId: adminUserId,
      action: `EMPLOYER_STATUS_${status}`,
      resourceType: 'EMPLOYER',
      resourceId: employer._id.toString(),
      metadata: { previousStatus, newStatus: status, rejectionReason },
    });

    return employer;
  }
}

module.exports = new EmployerService();
