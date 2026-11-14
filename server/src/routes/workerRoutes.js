const express = require('express');
const workerController = require('../controllers/workerController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.get('/profile', authenticate, authorize(ROLES.WORKER), workerController.getProfile);
router.put('/profile', authenticate, authorize(ROLES.WORKER), workerController.updateProfile);
router.post('/verification', authenticate, authorize(ROLES.WORKER), workerController.submitVerification);
router.get('/applications', authenticate, authorize(ROLES.WORKER), workerController.getApplications);

// Authorized candidate inspection (PII Redacted)
router.get('/:id', authenticate, authorize(ROLES.EMPLOYER, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COMPLIANCE_OFFICER), workerController.getWorkerById);

module.exports = router;
