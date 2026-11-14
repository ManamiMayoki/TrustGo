const express = require('express');
const complianceController = require('../controllers/complianceController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// List all audits (Compliance Officer, Admin, Super Admin)
router.get(
  '/audits',
  authenticate,
  authorize(ROLES.COMPLIANCE_OFFICER, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  complianceController.listAudits
);

// Get audit by ID
router.get(
  '/audits/:id',
  authenticate,
  complianceController.getAuditById
);

// Get audit by application ID
router.get(
  '/audits/application/:applicationId',
  authenticate,
  complianceController.getAuditByApplication
);

// Run 10-point audit
router.post(
  '/audits/run',
  authenticate,
  authorize(ROLES.COMPLIANCE_OFFICER, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  complianceController.runAudit
);

// Download PDF Compliance Audit Report
router.get('/reports/:id/pdf', authenticate, complianceController.downloadPdf);

// Report grievance / compliance flag
router.post('/flags', authenticate, complianceController.reportFlag);

// List compliance flags
router.get(
  '/flags',
  authenticate,
  authorize(ROLES.COMPLIANCE_OFFICER, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  complianceController.listFlags
);

module.exports = router;
