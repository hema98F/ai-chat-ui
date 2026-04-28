import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private baseUrl = environment.agentUrl;

  constructor(private http: HttpClient) {}

  findJobs(userMessage: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/agent`, { userMessage });
  }

  getSavedJobs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/jobs`);
  }
}
