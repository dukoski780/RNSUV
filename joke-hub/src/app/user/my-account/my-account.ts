import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserStoreService } from '../../services/user-store.service';
import { JokeService } from '../../services/joke.service';
import { Observable, map } from 'rxjs';

/**
 * My Account component - WooCommerce-style account page with password change
 */
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.html',
  styleUrl: './my-account.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MyAccount {
  // Password change form fields
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // UI state
  message = '';
  isError = false;
  isLoading = false;
  activeSection = 'dashboard'; // Track active sidebar section

  // Account statistics
  totalJokes$: Observable<number>;
  favoriteJokes$: Observable<number>;

  constructor(
    private http: HttpClient,
    public userStore: UserStoreService,
    private jokeService: JokeService
  ) {
    // Calculate account statistics
    this.totalJokes$ = this.jokeService.jokes$.pipe(
      map(jokes => jokes.filter(j => j.author === this.userStore.username).length)
    );

    this.favoriteJokes$ = this.jokeService.jokes$.pipe(
      map(jokes => jokes.filter(j => j.favorite).length)
    );
  }

  /** Changes user password */
  changePassword() {
    // Validation
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.showError('Please fill in all fields');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.showError('New passwords do not match');
      return;
    }

    if (this.newPassword.length < 4) {
      this.showError('New password must be at least 4 characters');
      return;
    }

    if (this.newPassword === this.currentPassword) {
      this.showError('New password must be different from current password');
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.http.put('/api/user/password', {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.showSuccess(response.msg);
        // Clear form
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error.error?.msg || 'Failed to change password');
      }
    });
  }

  /** Shows success message */
  private showSuccess(msg: string) {
    this.message = msg;
    this.isError = false;
  }

  /** Shows error message */
  private showError(msg: string) {
    this.message = msg;
    this.isError = true;
  }

  /** Scrolls to a specific section on the page */
  scrollToSection(sectionId: string) {
    this.activeSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
