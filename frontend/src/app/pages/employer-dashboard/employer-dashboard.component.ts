import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Job, JobPayload, JobType } from '../../models/job.model';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="dashboard-header">
      <div>
        <p class="eyebrow">Employer dashboard</p>
        <h1>{{ authService.getCurrentUser()?.companyName || 'Your company' }}</h1>
        <p>Create, edit, and delete job posts. Candidate applications appear on the applications page.</p>
      </div>
      <a routerLink="/applications" class="btn">View applications</a>
    </section>

    <section class="employer-layout">
      <form class="card form-card" [formGroup]="form" (ngSubmit)="saveJob()">
        <h2>{{ editingJobId ? 'Edit job' : 'Create a job' }}</h2>

        <label>
          Job title
          <input type="text" formControlName="title" placeholder="Junior Angular Developer">
        </label>

        <div class="form-row">
          <label>
            Location
            <input type="text" formControlName="location" placeholder="Bengaluru">
          </label>
          <label>
            Job type
            <select formControlName="jobType">
              @for (type of jobTypes; track type) {
                <option [value]="type">{{ type }}</option>
              }
            </select>
          </label>
        </div>

        <label>
          Salary range
          <input type="text" formControlName="salaryRange" placeholder="4 LPA - 6 LPA">
        </label>

        <label>
          Skills
          <input type="text" formControlName="skillsText" placeholder="Angular, TypeScript, REST APIs">
        </label>

        <label>
          Description
          <textarea rows="6" formControlName="description" placeholder="Describe responsibilities and requirements..."></textarea>
        </label>

        @if (message) {
          <p class="alert">{{ message }}</p>
        }

        <div class="card-actions">
          <button class="btn" type="submit" [disabled]="form.invalid">
            {{ editingJobId ? 'Update job' : 'Create job' }}
          </button>
          @if (editingJobId) {
            <button class="btn ghost" type="button" (click)="resetForm()">Cancel</button>
          }
        </div>
      </form>

      <div>
        <h2>My jobs</h2>
        <div class="stack">
          @for (job of jobs; track job._id) {
            <article class="card job-card">
              <div>
                <span class="pill">{{ job.jobType }}</span>
                <h3>{{ job.title }}</h3>
                <p class="muted">{{ job.location }} · {{ job.salaryRange }}</p>
              </div>
              <p>{{ job.description }}</p>
              <div class="card-actions">
                <button class="btn ghost small" type="button" (click)="editJob(job)">Edit</button>
                <button class="btn danger small" type="button" (click)="deleteJob(job._id)">Delete</button>
              </div>
            </article>
          } @empty {
            <p class="card muted">Create your first job post.</p>
          }
        </div>
      </div>
    </section>
  `
})
export class EmployerDashboardComponent implements OnInit {
  jobs: Job[] = [];
  jobTypes: JobType[] = ['Full-time', 'Part-time', 'Internship', 'Remote'];
  editingJobId = '';
  message = '';

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    location: ['', Validators.required],
    jobType: ['Full-time' as JobType, Validators.required],
    salaryRange: ['Not disclosed', Validators.required],
    skillsText: [''],
    description: ['', [Validators.required, Validators.minLength(20)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    readonly authService: AuthService,
    private readonly jobService: JobService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getMyJobs().subscribe((jobs) => {
      this.jobs = jobs;
    });
  }

  saveJob(): void {
    if (this.form.invalid) {
      return;
    }

    const payload = this.toPayload();
    const request = this.editingJobId
      ? this.jobService.updateJob(this.editingJobId, payload)
      : this.jobService.createJob(payload);

    request.subscribe(() => {
      this.message = this.editingJobId ? 'Job updated.' : 'Job created.';
      this.resetForm();
      this.loadJobs();
    });
  }

  editJob(job: Job): void {
    this.editingJobId = job._id;
    this.form.patchValue({
      title: job.title,
      location: job.location,
      jobType: job.jobType,
      salaryRange: job.salaryRange,
      skillsText: job.skills.join(', '),
      description: job.description
    });
  }

  deleteJob(id: string): void {
    if (!confirm('Delete this job and its applications?')) {
      return;
    }

    this.jobService.deleteJob(id).subscribe(() => {
      this.loadJobs();
    });
  }

  resetForm(): void {
    this.editingJobId = '';
    this.form.reset({
      title: '',
      location: '',
      jobType: 'Full-time',
      salaryRange: 'Not disclosed',
      skillsText: '',
      description: ''
    });
  }

  private toPayload(): JobPayload {
    const value = this.form.getRawValue();

    return {
      title: value.title,
      location: value.location,
      jobType: value.jobType,
      salaryRange: value.salaryRange,
      description: value.description,
      skills: value.skillsText
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean)
    };
  }
}
