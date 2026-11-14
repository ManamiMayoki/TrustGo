const { VerifiedJob, Employer, WorkerApplication, AuditLog } = require('../models');
const ApiError = require('../utils/apiError');
const { JOB_STATUS, EMPLOYER_VERIFICATION_STATUS } = require('../constants/statuses');

class JobService {
  async createJob(userId, jobData) {
    const employer = await Employer.findOne({ userId });
    if (!employer) {
      throw ApiError.forbidden('Employer profile must be created before posting jobs');
    }

    if (employer.verificationStatus !== EMPLOYER_VERIFICATION_STATUS.VERIFIED) {
      throw ApiError.forbidden(
        'Only verified employers with valid legal credentials may publish job listings. Current status: ' +
          employer.verificationStatus,
        'EMPLOYER_NOT_VERIFIED'
      );
    }

    const job = new VerifiedJob({
      ...jobData,
      employerId: employer._id,
      zeroWorkerFeeGuarantee: true,
      status: JOB_STATUS.PUBLISHED,
    });

    await job.save();

    await AuditLog.create({
      userId,
      action: 'JOB_CREATED',
      resourceType: 'VERIFIED_JOB',
      resourceId: job._id.toString(),
      metadata: { title: job.title, country: job.country, vacancies: job.vacancies },
    });

    return job;
  }

  async listJobs({ page = 1, limit = 12, country, industry, search, minSalary, employerId, status }) {
    const query = {};

    // By default, public list only shows published jobs
    if (status && typeof status === 'string') {
      query.status = status;
    } else {
      query.status = JOB_STATUS.PUBLISHED;
    }

    if (employerId && typeof employerId === 'string') {
      query.employerId = employerId;
    }

    if (country && typeof country === 'string') {
      query.country = new RegExp(country, 'i');
    }

    if (industry && typeof industry === 'string') {
      query.industry = new RegExp(industry, 'i');
    }

    if (minSalary) {
      query['salary.base'] = { $gte: Number(minSalary) };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      VerifiedJob.find(query)
        .populate('employerId', 'companyName country representative verificationStatus esgRating')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      VerifiedJob.countDocuments(query),
    ]);

    return {
      jobs,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getJobById(id) {
    const job = await VerifiedJob.findById(id).populate(
      'employerId',
      'companyName country address representative verificationStatus esgRating website'
    );
    if (!job) {
      throw ApiError.notFound('Job listing not found');
    }
    return job;
  }

  async updateJob(id, updateData) {
    const job = await VerifiedJob.findById(id);
    if (!job) {
      throw ApiError.notFound('Job listing not found');
    }

    // Do not permit overriding the zero fee guarantee
    updateData.zeroWorkerFeeGuarantee = true;

    Object.assign(job, updateData);
    await job.save();
    return job;
  }

  async setJobStatus(id, status, userId) {
    const job = await VerifiedJob.findById(id);
    if (!job) {
      throw ApiError.notFound('Job listing not found');
    }

    job.status = status;
    await job.save();

    await AuditLog.create({
      userId,
      action: `JOB_STATUS_${status}`,
      resourceType: 'VERIFIED_JOB',
      resourceId: job._id.toString(),
      metadata: { newStatus: status },
    });

    return job;
  }

  async getJobApplications(jobId, employerId) {
    const applications = await WorkerApplication.find({ jobId, employerId })
      .populate('workerId')
      .populate('jobId', 'title country city')
      .sort({ createdAt: -1 });

    return applications;
  }
}

module.exports = new JobService();
