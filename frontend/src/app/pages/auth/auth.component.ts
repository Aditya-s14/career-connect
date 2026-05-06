import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="auth-layout">
      <div class="hero-card">
        <p class="eyebrow">Start hiring or start applying</p>
        <h1>One small portal that explains the whole MEAN stack.</h1>
        <p>
          Register as a candidate to apply for jobs, or as an employer to post jobs and review applications.
        </p>
        <div class="demo-box">
          <strong>Demo logins after seed:</strong>
          <span>candidate@example.com / password123</span>
          <span>employer@example.com / password123</span>
        </div>
      </div>

      <form class="card form-card" [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-tabs">
          <button type="button" [class.active]="mode === 'login'" (click)="setMode('login')">Login</button>
          <button type="button" [class.active]="mode === 'register'" (click)="setMode('register')">Register</button>
        </div>

        @if (mode === 'register') {
          <label>
            Full name
            <input type="text" formControlName="name" placeholder="Asha Candidate">
          </label>

          <label>
            I am a
            <select formControlName="role">
              <option value="candidate">Candidate</option>
              <option value="employer">Employer</option>
            </select>
          </label>

          @if (form.value.role === 'employer') {
            <label>
              Company name
              <input type="text" formControlName="companyName" placeholder="FreshWorks Lite">
            </label>
          } @else {
            <label>
              Skills
              <input type="text" formControlName="skillsText" placeholder="Angular, TypeScript, MongoDB">
            </label>
          }
        }

        <label>
          Email
          <input type="email" formControlName="email" placeholder="you@example.com">
        </label>

        <label>
          Password
          <input type="password" formControlName="password" placeholder="Minimum 6 characters">
        </label>

        @if (errorMessage) {
          <p class="alert error">{{ errorMessage }}</p>
        }

        <button class="btn full" type="submit" [disabled]="form.invalid || isLoading">
          {{ isLoading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account' }}
        </button>
      </form>
    </section>
  `
})
export class AuthComponent {
  mode: 'login' | 'register' = 'login';
  isLoading = false;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['candidate' as UserRole],
    companyName: [''],
    skillsText: ['']
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  setMode(mode: 'login' | 'register'): void {
    this.mode = mode;
    this.errorMessage = '';

    if (mode === 'register') {
      this.form.controls.name.addValidators(Validators.required);
    } else {
      this.form.controls.name.clearValidators();
    }

    this.form.controls.name.updateValueAndValidity();
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const value = this.form.getRawValue();
    const request =
      this.mode === 'login'
        ? this.authService.login(value.email, value.password)
        : this.authService.register({
            name: value.name,
            email: value.email,
            password: value.password,
            role: value.role,
            companyName: value.companyName,
            skills: value.skillsText
              .split(',')
              .map((skill) => skill.trim())
              .filter(Boolean)
          });

    request.subscribe({
      next: ({ user }) => this.router.navigateByUrl(user.role === 'candidate' ? '/candidate' : '/employer'),
      error: (error) => {
        this.errorMessage = error.error?.message || 'Something went wrong';
        this.isLoading = false;
      }
    });
  }
}
