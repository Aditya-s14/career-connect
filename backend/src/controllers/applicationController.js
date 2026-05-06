const { validationResult } = require('express-validator');
const Application = require('../models/Application');
const Job = require('../models/Job');

async function applyToJob(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const job = await Job.findById(req.params.jobId);

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.employer.equals(req.user._id)) {
    return res.status(400).json({ message: 'Employers cannot apply to their own jobs' });
  }

  try {
    const application = await Application.create({
      job: job._id,
      candidate: req.user._id,
      coverLetter: req.body.coverLetter
    });

    const populated = await application.populate([
      { path: 'job', select: 'title company location jobType' },
      { path: 'candidate', select: 'name email skills' }
    ]);

    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You have already applied to this job' });
    }

    res.status(500).json({ message: 'Could not apply to job', error: error.message });
  }
}

async function getMyApplications(req, res) {
  const applications = await Application.find({ candidate: req.user._id })
    .populate('job', 'title company location jobType salaryRange')
    .sort({ createdAt: -1 });

  res.json(applications);
}

async function getApplicationsForMyJobs(req, res) {
  const myJobs = await Job.find({ employer: req.user._id }).select('_id');
  const jobIds = myJobs.map((job) => job._id);

  const applications = await Application.find({ job: { $in: jobIds } })
    .populate('job', 'title company location')
    .populate('candidate', 'name email skills')
    .sort({ createdAt: -1 });

  res.json(applications);
}

async function updateApplicationStatus(req, res) {
  const { status } = req.body;
  const allowedStatuses = ['Applied', 'Reviewed', 'Shortlisted', 'Rejected'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid application status' });
  }

  const application = await Application.findById(req.params.id).populate('job');

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  if (!application.job.employer.equals(req.user._id)) {
    return res.status(403).json({ message: 'You can only update applications for your jobs' });
  }

  application.status = status;
  await application.save();

  const populated = await application.populate('candidate', 'name email skills');
  res.json(populated);
}

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsForMyJobs,
  updateApplicationStatus
};
