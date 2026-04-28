import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // private baseUrl = 'http://localhost:5000';

  private baseUrl = environment.chatUrl;

  constructor(private http: HttpClient) {}

  // Call 1 — start a session, get sessionId back
  startSession(): Observable<any> {
    return this.http.post(`${this.baseUrl}/chat/start`, {});
  }

  // Call 2 — send a message, get AI reply back
  sendMessage(sessionId: string, question: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/chat/${sessionId}/message`, { question });
  }

  // Call 3 — get full history
  getHistory(sessionId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/chat/${sessionId}/history`);
  }

streamMessage(sessionId: string, question: string): Promise<ReadableStream<Uint8Array>> {
  return fetch(`${this.baseUrl}/chat/${sessionId}/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  }).then((res: Response) => {
    if (!res.body) {
      throw new Error('No stream received');
    }
    return res.body;
  });
}
}
