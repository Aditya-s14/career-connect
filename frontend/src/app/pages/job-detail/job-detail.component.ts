import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Job } from '../../models/job.model';
import { AuthService } from '../../services/auth.service';
import { ApplicationService } from '../../services/application.service';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    @if (job) {
      <section class="detail-layout">
        <article class="card detail-card">
          <a routerLink="/jobs" class="back-link">Back to jobs</a>
          <span class="pill">{{ job.jobType }}</span>
          <h1>{{ job.title }}</h1>
          <p class="muted">{{ job.company }} · {{ job.location }}</p>
          <p class="salary">{{ job.salaryRange }}</p>

          <h3>About this role</h3>
          <p>{{ job.description }}</p>

          <h3>Skills</h3>
          <div class="chips">
            @for (skill of job.skills; track skill) {
              <span>{{ skill }}</span>
            }
          </div>
        </article>

        <aside class="card form-card">
          @if (authService.getCurrentUser()?.role === 'candidate') {
            <h2>Apply now</h2>
            <form [formGroup]="form" (ngSubmit)="apply()">
              <label>
                Cover letter
                <textarea formControlName="coverLetter" rows="7" placeholder="Explain why you are a good fit..."></textarea>
              </label>

              @if (message) {
                <p class="alert" [class.error]="isError">{{ message }}</p>
              }

              <button class="btn full" type="submit" [disabled]="form.invalid || isLoading">
                {{ isLoading ? 'Applying...' : 'Apply to job' }}
              </button>
            </form>
          } @else if (authService.getCurrentUser()?.role === 'employer') {
            <h2>Employer view</h2>
            <p class="muted">Employers can manage their own jobs from the dashboard.</p>
            <a routerLink="/employer" class="btn full">Go to dashboard</a>
          } @else {
            <h2>Ready to apply?</h2>
            <p class="muted">Login as a candidate to send your application.</p>
            <a routerLink="/auth" class="btn full">Login to apply</a>
          }
        </aside>
      </section>
    } @else {
      <p class="muted center">Loading job details...</p>
    }
  `
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  isLoading = false;
  isError = false;
  message = '';

  form = this.fb.nonNullable.group({
    coverLetter: ['', [Validators.required, Validators.minLength(20)]]
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    readonly authService: AuthService,
    private readonly jobService: JobService,
    private readonly applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.jobService.getJob(id).subscribe((job) => {
      this.job = job;
    });
  }

  apply(): void {
    if (!this.job || this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.applicationService.apply(this.job._id, this.form.getRawValue().coverLetter).subscribe({
      next: () => {
        this.message = 'Application submitted successfully.';
        this.isError = false;
        this.isLoading = false;
        this.form.reset();
      },
      error: (error) => {
        this.message = error.error?.message || 'Could not submit application';
        this.isError = true;
        this.isLoading = false;
      }
    });
  }
}
