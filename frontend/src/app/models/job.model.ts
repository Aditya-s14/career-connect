import { User } from './user.model';

export type JobType = 'Full-time' | 'Part-time' | 'Internship' | 'Remote';

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: JobType;
  salaryRange: string;
  description: string;
  skills: string[];
  employer?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobPayload {
  title: string;
  company?: string;
  location: string;
  jobType: JobType;
  salaryRange: string;
  description: string;
  skills: string[];
}
