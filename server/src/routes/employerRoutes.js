const express = require('express');
const employerController = require('../controllers/employerController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.get('/profile', authenticate, authorize(ROLES.EMPLOYER), employerController.getProfile);
router.put('/profile', authenticate, authorize(ROLES.EMPLOYER), employerController.updateProfile);
router.post('/verify', authenticate, authorize(ROLES.EMPLOYER), employerController.submitVerification);

// Admin / Public endpoints
router.get('/', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COMPLIANCE_OFFICER), employerController.listEmployers);
router.get('/:id', authenticate, employerController.getEmployerById);
router.patch('/:id/status', authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), employerController.updateStatus);

module.exports = router;
