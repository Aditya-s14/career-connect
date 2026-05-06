const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put(
  '/profile',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
    body('companyName').optional().trim().notEmpty().withMessage('Company name cannot be empty')
  ],
  updateProfile
);

module.exports = router;
