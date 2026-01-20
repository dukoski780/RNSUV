import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStoreService } from '../../../services/user-store.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  standalone: true,
  imports: [CommonModule]
})
export class Footer {
  currentYear: number = new Date().getFullYear();

  constructor(public userStore: UserStoreService) {}
}
