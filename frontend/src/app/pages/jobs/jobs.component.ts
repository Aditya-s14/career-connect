import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Job, JobType } from '../../models/job.model';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="page-hero">
      <div>
        <p class="eyebrow">Fresh opportunities</p>
        <h1>Find simple, starter-friendly jobs.</h1>
        <p>Search openings, inspect details, and apply after logging in as a candidate.</p>
      </div>
      <a routerLink="/auth" class="btn">Get started</a>
    </section>

    <section class="card filter-card" [formGroup]="filters">
      <input type="search" formControlName="search" placeholder="Search by title, company, or city">
      <select formControlName="type">
        <option value="">All job types</option>
        @for (type of jobTypes; track type) {
          <option [value]="type">{{ type }}</option>
        }
      </select>
      <button class="btn" type="button" (click)="loadJobs()">Search</button>
    </section>

    @if (isLoading) {
      <p class="muted center">Loading jobs...</p>
    } @else {
      <section class="job-grid">
        @for (job of jobs; track job._id) {
          <article class="card job-card">
            <div>
              <span class="pill">{{ job.jobType }}</span>
              <h2>{{ job.title }}</h2>
              <p class="muted">{{ job.company }} · {{ job.location }}</p>
            </div>
            <p>{{ job.description }}</p>
            <div class="chips">
              @for (skill of job.skills; track skill) {
                <span>{{ skill }}</span>
              }
            </div>
            <div class="card-actions">
              <strong>{{ job.salaryRange }}</strong>
              <a [routerLink]="['/jobs', job._id]" class="btn ghost">View details</a>
            </div>
          </article>
        } @empty {
          <p class="muted center">No jobs found. Try another search.</p>
        }
      </section>
    }
  `
})
export class JobsComponent implements OnInit {
  jobs: Job[] = [];
  isLoading = true;
  jobTypes: JobType[] = ['Full-time', 'Part-time', 'Internship', 'Remote'];

  filters = this.fb.nonNullable.group({
    search: [''],
    type: ['']
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly jobService: JobService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading = true;
    const { search, type } = this.filters.getRawValue();

    this.jobService.getJobs(search, type).subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.isLoading = false;
      },
      error: () => {
        this.jobs = [];
        this.isLoading = false;
      }
    });
  }
}
