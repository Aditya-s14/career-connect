import { Routes } from '@angular/router';
import { roleGuard } from './guards/auth.guard';
import { AuthComponent } from './pages/auth/auth.component';
import { CandidateDashboardComponent } from './pages/candidate-dashboard/candidate-dashboard.component';
import { EmployerDashboardComponent } from './pages/employer-dashboard/employer-dashboard.component';
import { JobDetailComponent } from './pages/job-detail/job-detail.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { ApplicationsComponent } from './pages/applications/applications.component';

export const routes: Routes = [
  { path: '', component: JobsComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'jobs/:id', component: JobDetailComponent },
  { path: 'candidate', component: CandidateDashboardComponent, canActivate: [roleGuard('candidate')] },
  { path: 'employer', component: EmployerDashboardComponent, canActivate: [roleGuard('employer')] },
  { path: 'applications', component: ApplicationsComponent, canActivate: [roleGuard('employer')] },
  { path: '**', redirectTo: '' }
];
