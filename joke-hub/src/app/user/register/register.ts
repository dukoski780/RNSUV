import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink]
})
export class Register {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  message: string = '';
  isError: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    if (!this.username || !this.password || !this.confirmPassword) {
      this.message = 'Please fill in all fields';
      this.isError = true;
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      this.isError = true;
      return;
    }

    this.authService.register(this.username, this.password).subscribe({
      next: (response) => {
        this.message = response.msg;
        this.isError = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        this.message = error.error?.msg || 'Registration failed';
        this.isError = true;
      }
    });
  }
}
