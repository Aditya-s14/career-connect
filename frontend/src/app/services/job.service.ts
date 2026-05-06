import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Job, JobPayload } from '../models/job.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly apiUrl = `${environment.apiUrl}/jobs`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  getJobs(search = '', type = ''): Observable<Job[]> {
    let params = new HttpParams();

    if (search) {
      params = params.set('search', search);
    }

    if (type) {
      params = params.set('type', type);
    }

    return this.http.get<Job[]>(this.apiUrl, { params });
  }

  getJob(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }

  getMyJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/mine`, { headers: this.authHeaders() });
  }

  createJob(payload: JobPayload): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, payload, { headers: this.authHeaders() });
  }

  updateJob(id: string, payload: JobPayload): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/${id}`, payload, { headers: this.authHeaders() });
  }

  deleteJob(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers: this.authHeaders() });
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
  }
}
