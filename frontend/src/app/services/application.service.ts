import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JobApplication, ApplicationStatus } from '../models/application.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly apiUrl = `${environment.apiUrl}/applications`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  apply(jobId: string, coverLetter: string): Observable<JobApplication> {
    return this.http.post<JobApplication>(
      `${this.apiUrl}/jobs/${jobId}/apply`,
      { coverLetter },
      { headers: this.authHeaders() }
    );
  }

  getMyApplications(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/mine`, { headers: this.authHeaders() });
  }

  getEmployerApplications(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/employer`, { headers: this.authHeaders() });
  }

  updateStatus(id: string, status: ApplicationStatus): Observable<JobApplication> {
    return this.http.patch<JobApplication>(`${this.apiUrl}/${id}/status`, { status }, { headers: this.authHeaders() });
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
  }
}
