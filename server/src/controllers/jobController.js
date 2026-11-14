const jobService = require('../services/jobService');
const { sendResponse } = require('../utils/apiResponse');
const { Employer } = require('../models');
const { JOB_STATUS } = require('../constants/statuses');

class JobController {
  async createJob(req, res, next) {
    try {
      const job = await jobService.createJob(req.user._id, req.body);
      return sendResponse(res, 201, 'Job created successfully', job);
    } catch (error) {
      next(error);
    }
  }

  async listJobs(req, res, next) {
    try {
      const result = await jobService.listJobs(req.query);
      return sendResponse(res, 200, 'Jobs retrieved', result.jobs, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getMyJobs(req, res, next) {
    try {
      const employer = await Employer.findOne({ userId: req.user._id });
      if (!employer) {
        return sendResponse(res, 200, 'No employer profile', []);
      }
      const result = await jobService.listJobs({ ...req.query, employerId: employer._id, status: undefined });
      return sendResponse(res, 200, 'Employer jobs retrieved', result.jobs, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getJobById(req, res, next) {
    try {
      const job = await jobService.getJobById(req.params.id);
      return sendResponse(res, 200, 'Job details retrieved', job);
    } catch (error) {
      next(error);
    }
  }

  async updateJob(req, res, next) {
    try {
      const job = await jobService.updateJob(req.params.id, req.body);
      return sendResponse(res, 200, 'Job updated successfully', job);
    } catch (error) {
      next(error);
    }
  }

  async publishJob(req, res, next) {
    try {
      const job = await jobService.setJobStatus(req.params.id, JOB_STATUS.PUBLISHED, req.user._id);
      return sendResponse(res, 200, 'Job published successfully', job);
    } catch (error) {
      next(error);
    }
  }

  async archiveJob(req, res, next) {
    try {
      const job = await jobService.setJobStatus(req.params.id, JOB_STATUS.ARCHIVED, req.user._id);
      return sendResponse(res, 200, 'Job archived successfully', job);
    } catch (error) {
      next(error);
    }
  }

  async getJobApplications(req, res, next) {
    try {
      const employer = await Employer.findOne({ userId: req.user._id });
      const applications = await jobService.getJobApplications(req.params.id, employer?._id);
      return sendResponse(res, 200, 'Applications retrieved', applications);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new JobController();
