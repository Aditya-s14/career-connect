const { validationResult } = require('express-validator');
const Job = require('../models/Job');
const Application = require('../models/Application');

async function getJobs(req, res) {
  const { search = '', type = '' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } }
    ];
  }

  if (type) {
    query.jobType = type;
  }

  const jobs = await Job.find(query).populate('employer', 'name companyName email').sort({ createdAt: -1 });
  res.json(jobs);
}

async function getJobById(req, res) {
  const job = await Job.findById(req.params.id).populate('employer', 'name companyName email');

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  res.json(job);
}

async function getMyJobs(req, res) {
  const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
  res.json(jobs);
}

async function createJob(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const job = await Job.create({
    ...req.body,
    employer: req.user._id,
    company: req.user.companyName || req.body.company
  });

  res.status(201).json(job);
}

async function updateJob(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, employer: req.user._id },
    { ...req.body, company: req.user.companyName || req.body.company },
    { new: true, runValidators: true }
  );

  if (!job) {
    return res.status(404).json({ message: 'Job not found or not owned by you' });
  }

  res.json(job);
}

async function deleteJob(req, res) {
  const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user._id });

  if (!job) {
    return res.status(404).json({ message: 'Job not found or not owned by you' });
  }

  // Removing related applications keeps the demo database simple and tidy.
  await Application.deleteMany({ job: job._id });
  res.json({ message: 'Job deleted successfully' });
}

module.exports = {
  getJobs,
  getJobById,
  getMyJobs,
  createJob,
  updateJob,
  deleteJob
};
