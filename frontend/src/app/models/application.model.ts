import { Job } from './job.model';
import { User } from './user.model';

export type ApplicationStatus = 'Applied' | 'Reviewed' | 'Shortlisted' | 'Rejected';

export interface JobApplication {
  _id: string;
  job: Job;
  candidate: User;
  coverLetter: string;
  status: ApplicationStatus;
  createdAt: string;
}
