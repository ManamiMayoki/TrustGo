const employerService = require('../services/employerService');
const { sendResponse } = require('../utils/apiResponse');

class EmployerController {
  async getProfile(req, res, next) {
    try {
      const employer = await employerService.getProfile(req.user._id);
      return sendResponse(res, 200, 'Employer profile retrieved', employer);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const employer = await employerService.updateProfile(req.user._id, req.body);
      return sendResponse(res, 200, 'Profile updated successfully', employer);
    } catch (error) {
      next(error);
    }
  }

  async submitVerification(req, res, next) {
    try {
      const { documents } = req.body;
      const employer = await employerService.submitVerification(req.user._id, documents);
      return sendResponse(res, 200, 'Verification documents submitted for review', employer);
    } catch (error) {
      next(error);
    }
  }

  async listEmployers(req, res, next) {
    try {
      const result = await employerService.listEmployers(req.query);
      return sendResponse(res, 200, 'Employers retrieved', result.employers, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getEmployerById(req, res, next) {
    try {
      const employer = await employerService.getEmployerById(req.params.id);
      return sendResponse(res, 200, 'Employer details retrieved', employer);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { status, rejectionReason } = req.body;
      const employer = await employerService.updateStatus(req.params.id, status, rejectionReason, req.user._id);
      return sendResponse(res, 200, `Employer status updated to ${status}`, employer);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployerController();
