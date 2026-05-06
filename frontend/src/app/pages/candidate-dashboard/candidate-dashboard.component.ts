import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Job } from '../../models/job.model';
import { JobApplication } from '../../models/application.model';
import { AuthService } from '../../services/auth.service';
import { ApplicationService } from '../../services/application.service';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="dashboard-header">
      <div>
        <p class="eyebrow">Candidate dashboard</p>
        <h1>Welcome, {{ authService.getCurrentUser()?.name }}</h1>
        <p>Browse jobs and track your submitted applications in one place.</p>
      </div>
      <a routerLink="/jobs" class="btn">Browse all jobs</a>
    </section>

    <section class="stats-grid">
      <div class="card stat-card">
        <span>{{ jobs.length }}</span>
        <p>Open jobs</p>
      </div>
      <div class="card stat-card">
        <span>{{ applications.length }}</span>
        <p>My applications</p>
      </div>
    </section>

    <section class="two-column">
      <div>
        <h2>Available jobs</h2>
        <div class="stack">
          @for (job of jobs.slice(0, 4); track job._id) {
            <article class="card compact-card">
              <div>
                <h3>{{ job.title }}</h3>
                <p class="muted">{{ job.company }} · {{ job.location }}</p>
              </div>
              <a [routerLink]="['/jobs', job._id]" class="btn ghost small">View</a>
            </article>
          }
        </div>
      </div>

      <div>
        <h2>My applications</h2>
        <div class="stack">
          @for (application of applications; track application._id) {
            <article class="card compact-card">
              <div>
                <h3>{{ application.job.title }}</h3>
                <p class="muted">{{ application.job.company }} · {{ application.status }}</p>
              </div>
              <span class="pill">{{ application.status }}</span>
            </article>
          } @empty {
            <p class="card muted">No applications yet.</p>
          }
        </div>
      </div>
    </section>
  `
})
export class CandidateDashboardComponent implements OnInit {
  jobs: Job[] = [];
  applications: JobApplication[] = [];

  constructor(
    readonly authService: AuthService,
    private readonly jobService: JobService,
    private readonly applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.jobService.getJobs().subscribe((jobs) => {
      this.jobs = jobs;
    });

    this.applicationService.getMyApplications().subscribe((applications) => {
      this.applications = applications;
    });
  }
}
