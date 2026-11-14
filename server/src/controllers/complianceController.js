const complianceService = require('../services/complianceService');
const { sendResponse } = require('../utils/apiResponse');

class ComplianceController {
  async listAudits(req, res, next) {
    try {
      const result = await complianceService.listAudits(req.query);
      return sendResponse(res, 200, 'Compliance audits retrieved', result.audits, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getAuditById(req, res, next) {
    try {
      const audit = await complianceService.getAuditById(req.params.id);
      return sendResponse(res, 200, 'Audit record retrieved', audit);
    } catch (error) {
      next(error);
    }
  }

  async getAuditByApplication(req, res, next) {
    try {
      const audit = await complianceService.getAuditByApplication(req.params.applicationId);
      return sendResponse(res, 200, 'Audit record retrieved for application', audit);
    } catch (error) {
      next(error);
    }
  }

  async runAudit(req, res, next) {
    try {
      const { applicationId, framework } = req.body;
      const audit = await complianceService.runAudit(applicationId, req.user._id, framework);
      return sendResponse(res, 200, '10-Point compliance audit executed successfully', audit);
    } catch (error) {
      next(error);
    }
  }

  async downloadPdf(req, res, next) {
    try {
      await complianceService.generateAuditPdf(req.params.id, res);
    } catch (error) {
      next(error);
    }
  }

  async reportFlag(req, res, next) {
    try {
      const flag = await complianceService.reportFlag(req.user._id, req.body);
      return sendResponse(res, 201, 'Compliance grievance submitted for investigation', flag);
    } catch (error) {
      next(error);
    }
  }

  async listFlags(req, res, next) {
    try {
      const result = await complianceService.listFlags(req.query);
      return sendResponse(res, 200, 'Compliance flags retrieved', result.flags, result.meta);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ComplianceController();
