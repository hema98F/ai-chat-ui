import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class ChatComponent implements OnInit {
  @ViewChild('chatBody') chatBody!: ElementRef;

  sessionId: string = '';
  messages: { role: string; content: string }[] = [];
  userInput: string = '';
  isLoading: boolean = false;
  isStarting: boolean = true;
  streamingContent: string = ''; // holds the current streaming text

  constructor(
    private chatService: ChatService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Auto-start a session when component loads
    this.chatService.startSession().subscribe({
      next: (res) => {
        this.sessionId = res.sessionId;
        this.isStarting = false;
        this.cd.detectChanges();
        console.log('Session started:', this.sessionId);
      },
      error: (err) => {
        console.error('Failed to start session:', err);
        this.isStarting = false;
      },
    });
  }

  // sendMessage(): void {
  //     const question = this.userInput.trim();

  //     // Don't send empty messages
  //     if (!question || this.isLoading) return;

  //     // Add user message to UI immediately
  //     this.messages.push({ role: 'user', content: question });
  //     this.userInput = '';
  //     this.isLoading = true;

  //     // Call backend
  //     this.chatService.sendMessage(this.sessionId, question).subscribe({
  //       next: (res) => {
  //         console.log('RESPONSE FROM BACKEND:', res);
  //         // Add AI reply to UI
  //         //  this.messages.push({ role: 'assistant', content: res.answer });
  //         this.messages = [...this.messages, { role: 'assistant', content: res.answer }];
  //         this.isLoading = false;
  //         this.cd.detectChanges();
  //       },
  //       error: (err) => {
  //         console.error('Error', err);
  //         this.messages.push({ role: 'assistant', content: 'Something went wrong. Try again.' });
  //         this.isLoading = false;
  //       },
  //     });
  //   }

  // Allow sending with Enter key

  async sendMessage(): Promise<void> {
    const question = this.userInput.trim();
    if (!question || this.isLoading) return;

    // Add user message to UI
    this.messages.push({ role: 'user', content: question });
    this.userInput = '';
    this.isLoading = true;
    this.streamingContent = ''; // reset streaming text

    try {
      // Get the stream
      const stream = await this.chatService.streamMessage(this.sessionId, question);
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      // Read chunks as they arrive
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk into text
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

        for (const line of lines) {
          const data = line.replace('data: ', '');

          if (data === '[DONE]') {
            // Stream finished — move streaming content to messages array
            this.messages.push({ role: 'assistant', content: this.streamingContent });
            this.streamingContent = '';
            this.isLoading = false;
            this.cd.detectChanges();
            this.scrollToBottom();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.token) {
              // Append each token — this triggers Angular change detection
              this.streamingContent += parsed.token;
              this.cd.detectChanges();
              this.scrollToBottom();
            }
          } catch (e) {
            // skip malformed chunks
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      this.messages.push({ role: 'assistant', content: 'Something went wrong. Try again.' });
      this.streamingContent = '';
      this.isLoading = false;
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (e) {}
  }
}
