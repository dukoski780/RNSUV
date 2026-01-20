import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink]
})
export class Login {
  username: string = '';
  password: string = '';
  message: string = '';
  isError: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.message = 'Please fill in all fields';
      this.isError = true;
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.message = response.msg;
        this.isError = false;
        setTimeout(() => {
          this.router.navigate(['/jokes/list']);
        }, 500);
      },
      error: (error) => {
        this.message = error.error?.msg || 'Login failed';
        this.isError = true;
      }
    });
  }
}
