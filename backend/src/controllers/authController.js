const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

function createToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '7d'
  });
}

function sendAuthResponse(res, user) {
  const token = createToken(user._id);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      skills: user.skills
    }
  });
}

async function register(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { name, email, password, role, companyName, skills } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    if (role === 'employer' && !companyName) {
      return res.status(400).json({ message: 'Company name is required for employers' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      companyName: role === 'employer' ? companyName : undefined,
      skills: role === 'candidate' ? skills || [] : []
    });

    sendAuthResponse(res.status(201), user);
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
}

async function login(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    sendAuthResponse(res, user);
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
}

async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, me };
