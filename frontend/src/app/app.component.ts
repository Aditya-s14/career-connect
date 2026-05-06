import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="app-shell">
      <nav class="navbar">
        <a routerLink="/" class="brand">
          <span class="brand-mark">JP</span>
          <span>Job Portal Lite</span>
        </a>

        <div class="nav-links">
          <a routerLink="/jobs" routerLinkActive="active">Jobs</a>

          @if (user$ | async; as user) {
            <a [routerLink]="user.role === 'candidate' ? '/candidate' : '/employer'" routerLinkActive="active">Dashboard</a>
            @if (user.role === 'employer') {
              <a routerLink="/applications" routerLinkActive="active">Applications</a>
            }
            <span class="nav-user">{{ user.name }}</span>
            <button class="btn ghost small" type="button" (click)="logout()">Logout</button>
          } @else {
            <a routerLink="/auth" class="btn small">Login</a>
          }
        </div>
      </nav>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  user$ = this.authService.currentUser$;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/jobs');
  }
}
