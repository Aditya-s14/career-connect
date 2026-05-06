import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobApplication, ApplicationStatus } from '../../models/application.model';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="dashboard-header">
      <div>
        <p class="eyebrow">Applications</p>
        <h1>Review candidates for your jobs.</h1>
        <p>Change the status as you move candidates through your hiring process.</p>
      </div>
    </section>

    <section class="stack">
      @for (application of applications; track application._id) {
        <article class="card application-card">
          <div>
            <span class="pill">{{ application.status }}</span>
            <h2>{{ application.candidate.name }}</h2>
            <p class="muted">{{ application.candidate.email }} applied for {{ application.job.title }}</p>
            <p>{{ application.coverLetter }}</p>
            <div class="chips">
              @for (skill of application.candidate.skills || []; track skill) {
                <span>{{ skill }}</span>
              }
            </div>
          </div>
          <label>
            Status
            <select [ngModel]="application.status" (ngModelChange)="changeStatus(application, $event)">
              @for (status of statuses; track status) {
                <option [value]="status">{{ status }}</option>
              }
            </select>
          </label>
        </article>
      } @empty {
        <p class="card muted">No applications yet.</p>
      }
    </section>
  `
})
export class ApplicationsComponent implements OnInit {
  applications: JobApplication[] = [];
  statuses: ApplicationStatus[] = ['Applied', 'Reviewed', 'Shortlisted', 'Rejected'];

  constructor(private readonly applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  changeStatus(application: JobApplication, status: ApplicationStatus): void {
    this.applicationService.updateStatus(application._id, status).subscribe((updated) => {
      application.status = updated.status;
    });
  }

  private loadApplications(): void {
    this.applicationService.getEmployerApplications().subscribe((applications) => {
      this.applications = applications;
    });
  }
}
