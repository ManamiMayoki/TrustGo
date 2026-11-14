const express = require('express');
const escrowController = require('../controllers/escrowController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// List escrows for authenticated user
router.get('/', authenticate, escrowController.listUserEscrows);

// Escrow by Application ID
router.get('/application/:applicationId', authenticate, escrowController.getEscrowByApplication);

// Escrow by ID
router.get('/:id', authenticate, escrowController.getEscrowById);

// Authorize milestone release (Admin / Compliance Officer)
router.patch(
  '/:id/verify-milestone',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COMPLIANCE_OFFICER),
  escrowController.verifyMilestone
);

// Worker Day-30 Voluntary Bengali Voice Check-In
router.post(
  '/:id/day-30-checkin',
  authenticate,
  authorize(ROLES.WORKER),
  escrowController.day30CheckIn
);

module.exports = router;
