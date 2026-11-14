const ApiError = require('../utils/apiError');
const { ROLES } = require('../constants/roles');
const { Employer, Worker, VerifiedJob, WorkerApplication } = require('../models');

/**
 * Verify that the authenticated user owns the job or is an Admin
 */
const checkJobOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.role === ROLES.SUPER_ADMIN || req.user.role === ROLES.ADMIN) {
      return next();
    }

    const employer = await Employer.findOne({ userId: req.user._id });
    if (!employer) {
      return next(ApiError.forbidden('Employer profile not found for user'));
    }

    const job = await VerifiedJob.findById(id);
    if (!job) {
      return next(ApiError.notFound('Job listing not found'));
    }

    if (job.employerId.toString() !== employer._id.toString()) {
      return next(ApiError.forbidden('You do not have permission to modify this job listing', 'BOLA_VIOLATION'));
    }

    req.employer = employer;
    req.job = job;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify application ownership (either applicant worker, target employer, or admin)
 */
const checkApplicationAccess = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.role === ROLES.SUPER_ADMIN || req.user.role === ROLES.ADMIN || req.user.role === ROLES.COMPLIANCE_OFFICER) {
      return next();
    }

    const application = await WorkerApplication.findById(id);
    if (!application) {
      return next(ApiError.notFound('Application not found'));
    }

    if (req.user.role === ROLES.WORKER) {
      const worker = await Worker.findOne({ userId: req.user._id });
      if (!worker || application.workerId.toString() !== worker._id.toString()) {
        return next(ApiError.forbidden('Access denied to this application record', 'IDOR_VIOLATION'));
      }
    } else if (req.user.role === ROLES.EMPLOYER) {
      const employer = await Employer.findOne({ userId: req.user._id });
      if (!employer || application.employerId.toString() !== employer._id.toString()) {
        return next(ApiError.forbidden('Access denied to this application record', 'BOLA_VIOLATION'));
      }
    }

    req.application = application;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkJobOwnership,
  checkApplicationAccess,
};
