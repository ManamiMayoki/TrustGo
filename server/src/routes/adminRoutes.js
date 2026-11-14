const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// Strict RBAC: All Admin endpoints require ADMIN or SUPER_ADMIN
router.use(authenticate, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.listUsers);
router.patch('/users/:id/status', authorize(ROLES.SUPER_ADMIN), adminController.updateUserStatus);
router.get('/audit-logs', adminController.listAuditLogs);

module.exports = router;
