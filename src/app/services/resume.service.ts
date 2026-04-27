import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  // private baseUrl = 'http://localhost:4000';

  private baseUrl = 'https://ai-resume-bot-production-d7b2.up.railway.app';

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
