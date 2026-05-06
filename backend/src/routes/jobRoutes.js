const express = require('express');
const { body } = require('express-validator');
const {
  getJobs,
  getJobById,
  getMyJobs,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { protect, allowRoles } = require('../middleware/auth');

const router = express.Router();

const jobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('description').isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('jobType').optional().isIn(['Full-time', 'Part-time', 'Internship', 'Remote']),
  body('skills').optional().isArray().withMessage('Skills must be an array')
];

router.get('/', getJobs);
router.get('/mine', protect, allowRoles('employer'), getMyJobs);
router.get('/:id', getJobById);
router.post('/', protect, allowRoles('employer'), jobValidation, createJob);
router.put('/:id', protect, allowRoles('employer'), jobValidation, updateJob);
router.delete('/:id', protect, allowRoles('employer'), deleteJob);

module.exports = router;
