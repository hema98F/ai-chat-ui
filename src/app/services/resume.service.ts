import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  // private baseUrl = 'http://localhost:4000';

  // private baseUrl = 'https://ai-resume-bot-production-d7b2.up.railway.app';

  private baseUrl = environment.resumeUrl;

  constructor(private http: HttpClient) {}

  uploadPdf(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('pdf', file);

    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  askQuestions(question: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/ask`, { question });
  }

  extractProfile(filename: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/extract-profile`, { filename });
  }
}
