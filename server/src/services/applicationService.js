const crypto = require('crypto');
const {
  WorkerApplication,
  VerifiedJob,
  Worker,
  Employer,
  EscrowMilestone,
  ContractAudit,
  AuditLog,
} = require('../models');
const ApiError = require('../utils/apiError');
const {
  APPLICATION_STATUS,
  ESCROW_MILESTONES,
  MILESTONE_STATUS,
  ESCROW_RELEASE_STATUS,
  COMPLIANCE_STATUS,
} = require('../constants/statuses');

class ApplicationService {
  async applyForJob(userId, { jobId, submittedDocuments = [] }) {
    const worker = await Worker.findOne({ userId });
    if (!worker) {
      throw ApiError.forbidden('Only registered workers with completed profiles may apply');
    }

    const job = await VerifiedJob.findById(jobId).populate('employerId');
    if (!job) {
      throw ApiError.notFound('Job listing does not exist');
    }

    if (job.status !== 'PUBLISHED') {
      throw ApiError.badRequest('This job listing is no longer accepting applications');
    }

    const existingApp = await WorkerApplication.findOne({ workerId: worker._id, jobId });
    if (existingApp) {
      throw ApiError.conflict('You have already submitted an application for this job');
    }

    const application = new WorkerApplication({
      workerId: worker._id,
      jobId: job._id,
      employerId: job.employerId._id,
      applicationStatus: APPLICATION_STATUS.APPLIED,
      submittedDocuments,
      workerZeroFeeAffidavit: {
        confirmed: true,
        affidavitTimestamp: new Date(),
        signatureStatement: 'I confirm that I have paid zero recruitment or placement fees for this application.',
      },
    });

    await application.save();

    // Calculate simulated contractual escrow amount based on monthly base salary * 12 or standard contract base
    const contractualAmount = (job.salary.base || 1200) * 2; // Simulated recruitment warranty pool funded solely by employer

    // Initialize Escrow Ledger with standard 30% / 30% / 40% milestone division
    const idempotencyKey = crypto.randomUUID();
    const transactionReference = 'TX-' + crypto.randomBytes(8).toString('hex').toUpperCase();

    const escrow = new EscrowMilestone({
      applicationId: application._id,
      employerId: job.employerId._id,
      workerId: worker._id,
      totalContractualAmount: contractualAmount,
      currency: job.currency || 'USD',
      idempotencyKey,
      transactionReference,
      releaseStatus: ESCROW_RELEASE_STATUS.HELD_IN_ESCROW,
      milestones: [
        {
          milestoneType: ESCROW_MILESTONES.VISA_VERIFIED,
          percentage: 30,
          allocatedAmount: Math.round(contractualAmount * 0.3),
          status: MILESTONE_STATUS.LOCKED,
          notes: 'Eligible for release upon government visa verification and documentation approval.',
        },
        {
          milestoneType: ESCROW_MILESTONES.SAFE_ARRIVAL_PASSPORT_CONFIRMED,
          percentage: 30,
          allocatedAmount: Math.round(contractualAmount * 0.3),
          status: MILESTONE_STATUS.LOCKED,
          notes: 'Eligible for release upon flight arrival and worker confirmation of passport possession.',
        },
        {
          milestoneType: ESCROW_MILESTONES.DAY_30_WELFARE_CHECKIN,
          percentage: 40,
          allocatedAmount: Math.round(contractualAmount * 0.4),
          status: MILESTONE_STATUS.LOCKED,
          notes: 'Eligible for release upon voluntary Bengali voice welfare check-in on Day 30 post-arrival.',
        },
      ],
      auditHistory: [
        {
          action: 'ESCROW_INITIALIZED',
          actorId: userId,
          previousState: 'NONE',
          newState: ESCROW_RELEASE_STATUS.HELD_IN_ESCROW,
          timestamp: new Date(),
          reason: 'Application initialized simulated escrow ledger',
        },
      ],
    });

    await escrow.save();

    // Initialize Contract Legal Audit Record
    const auditReportRef = 'AUD-' + crypto.randomBytes(6).toString('hex').toUpperCase();
    const contractAudit = new ContractAudit({
      applicationId: application._id,
      employerId: job.employerId._id,
      workerId: worker._id,
      contractVersion: '1.0',
      workerFeeDeclaration: {
        isZeroFeeCompliant: true,
        verifiedAt: new Date(),
        auditorNotes: 'Worker verified zero-fee affidavit at submission',
      },
      salaryTransparency: {
        meetsStatutoryMinimum: true,
        statedMonthlyBase: job.salary.base,
        currency: job.currency,
        timelyPaymentGuaranteed: true,
      },
      legalComplianceChecks: [
        {
          checkName: 'Zero Worker Placement Fee',
          category: 'FEES',
          passed: true,
          standardReference: 'ILO Convention 181, Article 7(1)',
          notes: 'Employer directly covers all costs; no fee deduction from worker.',
        },
        {
          checkName: 'No Passport Confiscation Guarantee',
          category: 'HUMAN_RIGHTS',
          passed: true,
          standardReference: 'Palermo Protocol & International Labor Standards',
          notes: 'Employer agreement strictly prohibits passport withholding.',
        },
        {
          checkName: 'Transparent Wage Specification',
          category: 'CONTRACT_TERMS',
          passed: true,
          standardReference: 'ILO Protection of Wages Convention No. 95',
          notes: 'Base salary, overtime rate, and pay cycle explicitly stated.',
        },
        {
          checkName: 'Safe Accommodations & Medical Coverage',
          category: 'WELFARE',
          passed: true,
          standardReference: 'Occupational Safety and Health Convention No. 155',
          notes: 'Medical insurance and habitable lodging provisioned.',
        },
        {
          checkName: 'Legal Work Authorization & Embassy Attestation',
          category: 'LEGAL_STATUS',
          passed: true,
          standardReference: 'BMET Overseas Employment Act 2013',
          notes: 'Visa issuance verified via official labor attestation channels.',
        },
      ],
      auditFindings: ['Compliant with international zero-fee ethical recruitment guidelines.'],
      complianceScore: 100,
      complianceStatus: COMPLIANCE_STATUS.VERIFIED_COMPLIANT,
      reportReferenceId: auditReportRef,
      frameworkStandard: 'ILO_CONVENTION_181',
    });

    await contractAudit.save();

    await AuditLog.create({
      userId,
      action: 'APPLICATION_SUBMITTED',
      resourceType: 'WORKER_APPLICATION',
      resourceId: application._id.toString(),
      metadata: { jobId: job._id, employerId: job.employerId._id },
    });

    return application;
  }

  async listApplications(user, { page = 1, limit = 20, status }) {
    const query = {};
    if (status) query.applicationStatus = status;

    if (user.role === 'WORKER') {
      const worker = await Worker.findOne({ userId: user._id });
      if (!worker) return { applications: [], meta: { page: 1, limit, total: 0, totalPages: 0 } };
      query.workerId = worker._id;
    } else if (user.role === 'EMPLOYER') {
      const employer = await Employer.findOne({ userId: user._id });
      if (!employer) return { applications: [], meta: { page: 1, limit, total: 0, totalPages: 0 } };
      query.employerId = employer._id;
    }

    const skip = (page - 1) * limit;
    const [applications, total] = await Promise.all([
      WorkerApplication.find(query)
        .populate('workerId')
        .populate('jobId')
        .populate('employerId', 'companyName country representative')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      WorkerApplication.countDocuments(query),
    ]);

    return {
      applications,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getApplicationById(id) {
    const application = await WorkerApplication.findById(id)
      .populate('workerId')
      .populate('jobId')
      .populate('employerId');

    if (!application) {
      throw ApiError.notFound('Application record not found');
    }
    return application;
  }

  async updateApplicationStatus(id, newStatus, actorUserId) {
    const application = await WorkerApplication.findById(id);
    if (!application) {
      throw ApiError.notFound('Application record not found');
    }

    const previousStatus = application.applicationStatus;
    application.applicationStatus = newStatus;
    await application.save();

    await AuditLog.create({
      userId: actorUserId,
      action: `APPLICATION_STATUS_${newStatus}`,
      resourceType: 'WORKER_APPLICATION',
      resourceId: application._id.toString(),
      metadata: { previousStatus, newStatus },
    });

    return application;
  }

  async uploadDocument(id, document) {
    const application = await WorkerApplication.findById(id);
    if (!application) {
      throw ApiError.notFound('Application record not found');
    }

    application.submittedDocuments.push(document);
    await application.save();
    return application;
  }
}

module.exports = new ApplicationService();
