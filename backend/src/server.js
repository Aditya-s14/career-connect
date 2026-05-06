require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 5001;

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200'
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Job Portal API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong', error: error.message });
});

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
