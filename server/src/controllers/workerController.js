const workerService = require('../services/workerService');
const { sendResponse } = require('../utils/apiResponse');

class WorkerController {
  async getProfile(req, res, next) {
    try {
      const worker = await workerService.getProfile(req.user._id);
      return sendResponse(res, 200, 'Worker profile retrieved', worker);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const worker = await workerService.updateProfile(req.user._id, req.body);
      return sendResponse(res, 200, 'Profile updated successfully', worker);
    } catch (error) {
      next(error);
    }
  }

  async submitVerification(req, res, next) {
    try {
      const worker = await workerService.submitTTCVerification(req.user._id, req.body);
      return sendResponse(res, 200, 'TTC & Identity verification submitted', worker);
    } catch (error) {
      next(error);
    }
  }

  async getApplications(req, res, next) {
    try {
      const applications = await workerService.getApplications(req.user._id);
      return sendResponse(res, 200, 'Applications retrieved', applications);
    } catch (error) {
      next(error);
    }
  }

  async getWorkerById(req, res, next) {
    try {
      const candidate = await workerService.getWorkerForEmployer(req.params.id);
      return sendResponse(res, 200, 'Candidate profile retrieved (PII Redacted)', candidate);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WorkerController();
