const express = require('express');
const { body } = require('express-validator');
const {
  applyToJob,
  getMyApplications,
  getApplicationsForMyJobs,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, allowRoles } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/jobs/:jobId/apply',
  protect,
  allowRoles('candidate'),
  [body('coverLetter').isLength({ min: 20 }).withMessage('Cover letter must be at least 20 characters')],
  applyToJob
);

router.get('/mine', protect, allowRoles('candidate'), getMyApplications);
router.get('/employer', protect, allowRoles('employer'), getApplicationsForMyJobs);
router.patch('/:id/status', protect, allowRoles('employer'), updateApplicationStatus);

module.exports = router;
