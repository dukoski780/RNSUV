import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Joke } from '../../models/joke';
import { UserStoreService } from '../../services/user-store.service';
import { JokeService } from '../../services/joke.service';

/**
 * Component for displaying a single joke card
 */
@Component({
  selector: 'app-joke-item',
  templateUrl: './joke-item.html',
  styleUrl: './joke-item.css',
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class JokeItem implements OnInit {
  @Input() joke!: Joke;
  @Output() favoriteToggled = new EventEmitter<Joke>();

  isExpanded: boolean = false;

  constructor(
    public userStore: UserStoreService,
    private jokeService: JokeService
  ) {}

  /** Auto-expands joke cards for admin users on initialization */
  ngOnInit() {
    if (this.userStore.isAdmin()) {
      this.isExpanded = true;
    }
  }

  /** Emits favorite toggle event to parent component */
  onToggleFavorite(event: Event) {
    event.stopPropagation();
    this.favoriteToggled.emit(this.joke);
  }

  /** Checks if the current user can edit this joke*/
  canEdit(): boolean {
    return this.userStore.isAdmin() || this.joke.author === this.userStore.username;
  }

  /** Toggles visibility of the joke punchline */
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  /** Prompts confirmation and deletes the joke */
  onDeleteJoke(event: Event) {
    event.stopPropagation();

    if (confirm(`Are you sure you want to delete this joke: "${this.joke.setup}"?`)) {
      this.jokeService.deleteJoke(this.joke.id).subscribe({
        next: (response) => {
          console.log(response.msg);
        },
        error: (error) => {
          console.error('Error deleting joke:', error);
          alert('Failed to delete joke. Please try again.');
        }
      });
    }
  }
}
