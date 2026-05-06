# Career Connect

A full-stack job portal built with Angular, Node.js, Express, MongoDB, Mongoose, JWT authentication, and Docker.

## Features

- Candidate registration and login
- Employer registration and login
- Candidate dashboard with available jobs and application history
- Employer dashboard to create, edit, and delete jobs
- Public job listing and job detail pages
- Candidate job applications
- Employer application review with status updates
- REST APIs for auth, jobs, users, and applications
- JWT authentication and role-based authorization
- Reactive form validation on the frontend
- Express validation on the backend
- Responsive UI with clean CSS
- Seed data script
- Docker Compose setup for frontend, backend, and MongoDB

## Project Structure

```text
Job_portal/
  backend/
    src/
      config/          MongoDB connection
      controllers/     Route business logic
      middleware/      JWT and role guards
      models/          Mongoose schemas
      routes/          REST route definitions
      scripts/         Seed data script
      server.js        Express app entry point
  frontend/
    src/app/
      guards/          Angular route guard
      models/          TypeScript interfaces
      pages/           Screen components
      services/        API service classes
  docker-compose.yml
  README.md
```

## Architecture

The project follows a simple client-server architecture.

The Angular frontend contains standalone components for pages such as login/register, jobs, job detail, candidate dashboard, employer dashboard, and applications. Angular services call the backend APIs through `HttpClient`. The auth service stores the JWT and logged-in user in `localStorage`.

The Express backend exposes REST APIs under `/api`. Controllers handle request logic, Mongoose models define MongoDB collections, and middleware checks JWT tokens and user roles. Candidates can apply to jobs, while employers can manage only their own jobs and applications.

MongoDB stores three main collections:

- `users`: candidates and employers
- `jobs`: jobs created by employers
- `applications`: candidate applications linked to jobs

## Run With Docker

```bash
docker compose up --build
```

Then open:

- Frontend: `http://localhost:4200`
- Backend health check: `http://localhost:5001/api/health`
- MongoDB: `mongodb://localhost:27017/job_portal_lite`

Seed data inside Docker:

```bash
docker compose exec backend npm run seed
```

Demo logins after seeding:

- Candidate: `candidate@example.com` / `password123`
- Employer: `employer@example.com` / `password123`

## Run Locally Without Docker

Start MongoDB locally first.

```bash
npm run install:all
cp backend/.env.example backend/.env
npm run seed
npm run dev:backend
```

In another terminal:

```bash
npm run dev:frontend
```

Open `http://localhost:4200`.

## API Routes

### Auth

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register candidate or employer |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | Authenticated | Get current user |

### Users

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/users/profile` | Authenticated | Get logged-in user profile |
| PUT | `/api/users/profile` | Authenticated | Update candidate skills or employer company name |

### Jobs

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/jobs` | Public | List jobs with optional `search` and `type` query params |
| GET | `/api/jobs/:id` | Public | Get one job |
| GET | `/api/jobs/mine` | Employer | Get employer's jobs |
| POST | `/api/jobs` | Employer | Create job |
| PUT | `/api/jobs/:id` | Employer | Update owned job |
| DELETE | `/api/jobs/:id` | Employer | Delete owned job |

### Applications

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/applications/jobs/:jobId/apply` | Candidate | Apply to a job |
| GET | `/api/applications/mine` | Candidate | Get candidate applications |
| GET | `/api/applications/employer` | Employer | Get applications for employer jobs |
| PATCH | `/api/applications/:id/status` | Employer | Update application status |

## Sample Request Bodies

Register employer:

```json
{
  "name": "Rohan Recruiter",
  "email": "employer@example.com",
  "password": "password123",
  "role": "employer",
  "companyName": "FreshWorks Lite"
}
```

Create job:

```json
{
  "title": "Junior Angular Developer",
  "location": "Bengaluru",
  "jobType": "Full-time",
  "salaryRange": "4 LPA - 6 LPA",
  "description": "Build Angular pages and connect them with REST APIs.",
  "skills": ["Angular", "TypeScript", "REST APIs"]
}
```

Apply to job:

```json
{
  "coverLetter": "I have hands-on experience with Angular and REST API integrations. I would like to apply for this role."
}
```

