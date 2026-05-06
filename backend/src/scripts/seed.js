require('dotenv').config();

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

async function seed() {
  await connectDB();

  await Application.deleteMany();
  await Job.deleteMany();
  await User.deleteMany();

  const password = await bcrypt.hash('password123', 10);

  const candidate = await User.create({
    name: 'Asha Candidate',
    email: 'candidate@example.com',
    password,
    role: 'candidate',
    skills: ['Angular', 'JavaScript', 'HTML', 'CSS']
  });

  const employer = await User.create({
    name: 'Rohan Recruiter',
    email: 'employer@example.com',
    password,
    role: 'employer',
    companyName: 'FreshWorks Lite'
  });

  const jobs = await Job.insertMany([
    {
      title: 'Junior Angular Developer',
      company: employer.companyName,
      location: 'Bengaluru',
      jobType: 'Full-time',
      salaryRange: '4 LPA - 6 LPA',
      description:
        'Build beginner-friendly dashboards, reusable Angular components, and API integrations with support from senior developers.',
      skills: ['Angular', 'TypeScript', 'REST APIs'],
      employer: employer._id
    },
    {
      title: 'MERN/MEAN Stack Intern',
      company: employer.companyName,
      location: 'Remote',
      jobType: 'Internship',
      salaryRange: '15k - 25k per month',
      description:
        'Learn full-stack development by creating Express APIs, MongoDB schemas, and responsive frontend pages.',
      skills: ['Node.js', 'Express', 'MongoDB'],
      employer: employer._id
    },
    {
      title: 'Frontend Trainee',
      company: employer.companyName,
      location: 'Pune',
      jobType: 'Part-time',
      salaryRange: '2 LPA - 3 LPA',
      description:
        'Create clean HTML, CSS, and Angular screens for a small hiring product while practicing Git and code reviews.',
      skills: ['HTML', 'CSS', 'Angular'],
      employer: employer._id
    }
  ]);

  await Application.create({
    job: jobs[0]._id,
    candidate: candidate._id,
    coverLetter:
      'I am a fresher who has practiced Angular and REST API projects. I would like to contribute and learn from this role.'
  });

  console.log('Seed data created');
  console.log('Candidate login: candidate@example.com / password123');
  console.log('Employer login: employer@example.com / password123');

  await mongoose.connection.close();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
