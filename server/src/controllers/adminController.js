const adminService = require('../services/adminService');
const { sendResponse } = require('../utils/apiResponse');

class AdminController {
  async getDashboard(req, res, next) {
    try {
      const data = await adminService.getDashboardMetrics();
      return sendResponse(res, 200, 'Admin platform metrics retrieved', data);
    } catch (error) {
      next(error);
    }
  }

  async listUsers(req, res, next) {
    try {
      const result = await adminService.listUsers(req.query);
      return sendResponse(res, 200, 'Users retrieved', result.users, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(req, res, next) {
    try {
      const { accountStatus, reason } = req.body;
      const user = await adminService.updateUserStatus(req.params.id, accountStatus, req.user._id, reason);
      return sendResponse(res, 200, `User account status updated to ${accountStatus}`, user);
    } catch (error) {
      next(error);
    }
  }

  async listAuditLogs(req, res, next) {
    try {
      const result = await adminService.listAuditLogs(req.query);
      return sendResponse(res, 200, 'System audit logs retrieved', result.logs, result.meta);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
