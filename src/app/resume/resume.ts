import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResumeService } from '../services/resume.service';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './resume.html',
  styleUrl: './resume.css',
})
export class Resume {
  // Upload state
  selectedFile: File | null = null;
  isUploading: boolean = false;
  uploadResult: any = null;

  // Chat state
  question: string = '';
  isAsking: boolean = false;
  conversation: { role: string; content: string; sources?: any[] }[] = [];

  profile: any = null;
  isExtracting: boolean = false;

  constructor(
    private resumeService: ResumeService,
    private cd: ChangeDetectorRef,
  ) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.uploadResult = null;
  }

  uploadPDF(): void {
    if (!this.selectedFile || this.isUploading) return;

    this.isUploading = true;
    this.resumeService.uploadPdf(this.selectedFile).subscribe({
next: (res) => {
  console.log('Upload result:', res);

  this.uploadResult = { ...res };
  this.isUploading = false;

  this.conversation = [];

  // (AUTO EXTRACT PROFILE)
  this.isExtracting = true;

  this.resumeService.extractProfile(res.filename).subscribe({
    next: (profileRes: any) => {
      this.profile = profileRes.profile;
      this.isExtracting = false;
      console.log('Profile:', this.profile);
      this.cd.detectChanges();
    },
    error: (err) => {
      console.error('Extract error:', err);
      this.isExtracting = false;
      this.cd.detectChanges();
    }
  });

  this.cd.detectChanges();
},
      error: (err) => {
        console.error('Upload error:', err);
        this.isUploading = false;

        this.cd.detectChanges();
      },
    });
  }

  askQuestion(): void {
    const q = this.question.trim();
    if (!q || this.isAsking) return;

    // Add user message
    this.conversation.push({ role: 'user', content: q });
    this.question = '';
    this.isAsking = true;

    this.resumeService.askQuestions(q).subscribe({
      next: (res) => {
        console.log('AI RESPONSE:', res);
        // Add AI answer with sources
        (this.conversation.push({
          role: 'assistant',
          content: res.answer,
          sources: res.sources,
        }),
          (this.isAsking = false));
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Ask error:', err);
        this.conversation.push({ role: 'assistant', content: 'Something went wrong.' });
        this.isAsking = false;
        this.cd.detectChanges();
      },
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.askQuestion();
    }
  }

  extractProfile(): void {
    if (!this.uploadResult) return;

    this.isExtracting = true;

    this.resumeService.extractProfile(this.uploadResult.filename).subscribe({
      next: (res) => {
        this.profile = res.profile;
        this.isExtracting = false;
        console.log('Profile:', this.profile);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Extract error:', err);
        this.isExtracting = false;
        this.cd.detectChanges();
      },
    });
  }

  formatEducation(education: any): string {
  if (!education) return 'Not specified';
  if (typeof education === 'string') return education;
  if (Array.isArray(education)) {
    return education.map(e =>
      typeof e === 'string' ? e : `${e.degree || ''} ${e.institution || ''} ${e.year || ''}`.trim()
    ).join(' | ');
  }
  return JSON.stringify(education);
}
}
