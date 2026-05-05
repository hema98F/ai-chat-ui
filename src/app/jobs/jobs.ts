import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AgentService } from '../services/agent.service';

@Component({
  selector: 'app-jobs',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './jobs.html',
  styleUrl: './jobs.css',
})
export class Jobs implements OnInit {
  userMessage = '';
  isRunning = false;
  steps: any[] = [];
  finalAnswer = '';
  savedJobs: any[] = [];
  activeTab = 'search';

  constructor(private agentService: AgentService) {}

  ngOnInit() {}

  runAgent() {
    if (!this.userMessage.trim() || this.isRunning) return;

    this.isRunning = true;
    this.steps = [];
    this.finalAnswer = '';

    this.agentService.findJobs(this.userMessage).subscribe({
      next: (res) => {
        this.steps = res.steps;
        this.finalAnswer = res.finalAnswer;
        this.isRunning = false;
        this.loadSavedJobs();
      },
      error: (err) => {
        console.error(err);
        this.isRunning = false;
      },
    });
  }

  loadSavedJobs(): void {
    this.agentService.getSavedJobs().subscribe({
      next: (res) => (this.savedJobs = res.jobs),
      error: (err) => console.error(err),
    });
  }
}
