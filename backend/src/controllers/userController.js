const { validationResult } = require('express-validator');
const User = require('../models/User');

async function getProfile(req, res) {
  res.json(req.user);
}

async function updateProfile(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const updates = {
    name: req.body.name,
    skills: req.user.role === 'candidate' ? req.body.skills || [] : [],
    companyName: req.user.role === 'employer' ? req.body.companyName : undefined
  };

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  }).select('-password');

  res.json(user);
}

module.exports = { getProfile, updateProfile };
