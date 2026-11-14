const applicationService = require('../services/applicationService');
const { sendResponse } = require('../utils/apiResponse');

class ApplicationController {
  async apply(req, res, next) {
    try {
      const application = await applicationService.applyForJob(req.user._id, req.body);
      return sendResponse(res, 201, 'Job application submitted successfully (Zero-Fee Protected)', application);
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const result = await applicationService.listApplications(req.user, req.query);
      return sendResponse(res, 200, 'Applications retrieved', result.applications, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const application = await applicationService.getApplicationById(req.params.id);
      return sendResponse(res, 200, 'Application details retrieved', application);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const application = await applicationService.updateApplicationStatus(req.params.id, status, req.user._id);
      return sendResponse(res, 200, `Application status updated to ${status}`, application);
    } catch (error) {
      next(error);
    }
  }

  async uploadDocument(req, res, next) {
    try {
      const application = await applicationService.uploadDocument(req.params.id, req.body);
      return sendResponse(res, 200, 'Document uploaded successfully', application);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ApplicationController();
