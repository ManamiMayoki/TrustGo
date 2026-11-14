const escrowService = require('../services/escrowService');
const { sendResponse } = require('../utils/apiResponse');

class EscrowController {
  async listUserEscrows(req, res, next) {
    try {
      const escrows = await escrowService.listUserEscrows(req.user);
      return sendResponse(res, 200, 'Escrow accounts retrieved', escrows);
    } catch (error) {
      next(error);
    }
  }

  async getEscrowById(req, res, next) {
    try {
      const escrow = await escrowService.getEscrowById(req.params.id);
      return sendResponse(res, 200, 'Escrow details retrieved', escrow);
    } catch (error) {
      next(error);
    }
  }

  async getEscrowByApplication(req, res, next) {
    try {
      const escrow = await escrowService.getEscrowByApplication(req.params.applicationId);
      return sendResponse(res, 200, 'Escrow details retrieved', escrow);
    } catch (error) {
      next(error);
    }
  }

  async verifyMilestone(req, res, next) {
    try {
      const { milestoneType, notes } = req.body;
      const escrow = await escrowService.verifyAndReleaseMilestone(
        req.params.id,
        milestoneType,
        req.user._id,
        notes
      );
      return sendResponse(res, 200, `Milestone ${milestoneType} successfully verified and released`, escrow);
    } catch (error) {
      next(error);
    }
  }

  async day30CheckIn(req, res, next) {
    try {
      const escrow = await escrowService.recordDay30CheckIn(req.params.id, req.user._id, req.body);
      return sendResponse(res, 200, 'Day-30 Bengali voice welfare check-in registered successfully', escrow);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EscrowController();
