import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  name = '';
  email = '';
  password = '';
  isLoading = false;
  error = '';

  constructor(
    private authAervice: AuthService,
    private router: Router,
  ) {}

  register(): void {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Please fill all fields';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authAervice.register(this.name, this.email, this.password).subscribe({
      next: (res) => {
        console.log('Registered:', res.user);
        this.router.navigate(['/resume']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Registration failed';
        this.isLoading = false;
      },
    });
  }
}
