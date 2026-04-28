import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  isLoading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login(): void {
    console.log('email:', this.email, 'password:', this.password);
    if (!this.email || !this.password) {
      this.error = 'Please fill all fields';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log('logged in: ', res.user);
        this.router.navigate(['/resume']);
      },
      error: (err) => {
        this.error = err.error?.error || 'login failed';
        this.isLoading = false;
      },
    });
  }
}
