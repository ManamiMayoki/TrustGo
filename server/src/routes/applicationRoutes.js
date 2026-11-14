const express = require('express');
const applicationController = require('../controllers/applicationController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { checkApplicationAccess } = require('../middlewares/ownershipMiddleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// Worker submits application
router.post('/', authenticate, authorize(ROLES.WORKER), applicationController.apply);

// List user's scoped applications
router.get('/', authenticate, applicationController.list);

// Get specific application (Worker, Employer, Admin)
router.get('/:id', authenticate, checkApplicationAccess, applicationController.getById);

// Update status (Employer or Admin)
router.patch(
  '/:id/status',
  authenticate,
  authorize(ROLES.EMPLOYER, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  checkApplicationAccess,
  applicationController.updateStatus
);

// Upload document (Worker or Employer)
router.post('/:id/documents', authenticate, checkApplicationAccess, applicationController.uploadDocument);

module.exports = router;
