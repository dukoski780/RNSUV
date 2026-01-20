import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserStoreService } from '../../../services/user-store.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class Header {
  isMenuOpen: boolean = false;

  constructor(
    public userStore: UserStoreService,
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/login']);
  }

  getUserInitials(): string {
    const username = this.userStore.username;
    if (!username) return 'U';
    const parts = username.split(' ');
    if (parts.length > 1) {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  }
}
