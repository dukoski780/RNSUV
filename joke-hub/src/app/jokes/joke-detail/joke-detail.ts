import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, switchMap, tap } from 'rxjs';
import { Joke } from '../../models/joke';
import { JokeService } from '../../services/joke.service';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-joke-detail',
  templateUrl: './joke-detail.html',
  styleUrl: './joke-detail.css',
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class JokeDetail implements OnInit {
  joke$!: Observable<Joke | undefined>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jokeService: JokeService,
    public userStore: UserStoreService
  ) {}

  ngOnInit(): void {
    this.joke$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        // Increment view count
        this.jokeService.incrementView(id).subscribe();
        return this.jokeService.getJokeById(id);
      })
    );
  }

  toggleFavorite(joke: Joke) {
    const newState = !joke.favorite;
    joke.favorite = newState;

    this.jokeService.toggleFavorite(joke, newState).subscribe({
      next: (response) => {
        console.log(response.msg);
      },
      error: (error) => {
        console.error('Error toggling favorite:', error);
        joke.favorite = !newState;
      }
    });
  }

  goBack() {
    this.router.navigate(['/jokes/list']);
  }

  canEdit(joke: Joke): boolean {
    return this.userStore.isAdmin() || joke.author === this.userStore.username;
  }

  /** Prompts confirmation and deletes the joke (admin only) */
  deleteJoke(joke: Joke) {
    if (confirm(`Are you sure you want to delete this joke: "${joke.setup}"?`)) {
      this.jokeService.deleteJoke(joke.id).subscribe({
        next: (response) => {
          console.log(response.msg);
          this.router.navigate(['/jokes/list']);
        },
        error: (error) => {
          console.error('Error deleting joke:', error);
          alert('Failed to delete joke. Please try again.');
        }
      });
    }
  }
}
