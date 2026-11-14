const express = require('express');
const jobController = require('../controllers/jobController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { checkJobOwnership } = require('../middlewares/ownershipMiddleware');
const { createJobSchema, updateJobSchema } = require('../validators/jobValidator');
const { validate } = require('../validators/authValidator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// Public: Browse jobs
router.get('/', jobController.listJobs);

// Authenticated: Employer my-jobs
router.get('/my-jobs', authenticate, authorize(ROLES.EMPLOYER), jobController.getMyJobs);

// Create Job (Employer only)
router.post(
  '/',
  authenticate,
  authorize(ROLES.EMPLOYER),
  validate(createJobSchema),
  jobController.createJob
);

// Job by ID (Public)
router.get('/:id', jobController.getJobById);

// Update Job (Owner only)
router.put(
  '/:id',
  authenticate,
  authorize(ROLES.EMPLOYER),
  checkJobOwnership,
  validate(updateJobSchema),
  jobController.updateJob
);

// Publish Job
router.patch(
  '/:id/publish',
  authenticate,
  authorize(ROLES.EMPLOYER),
  checkJobOwnership,
  jobController.publishJob
);

// Archive Job
router.patch(
  '/:id/archive',
  authenticate,
  authorize(ROLES.EMPLOYER),
  checkJobOwnership,
  jobController.archiveJob
);

// Get Applications for Job (Owner only)
router.get(
  '/:id/applications',
  authenticate,
  authorize(ROLES.EMPLOYER, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  checkJobOwnership,
  jobController.getJobApplications
);

module.exports = router;
