import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Joke } from '../../models/joke';
import { JokeService } from '../../services/joke.service';
import { UserStoreService } from '../../services/user-store.service';
import { JokeItem } from '../joke-item/joke-item';

/**
 * Component for displaying a filterable list of jokes with category and favorites filters
 */
@Component({
  selector: 'app-joke-list',
  templateUrl: './joke-list.html',
  styleUrl: './joke-list.css',
  standalone: true,
  imports: [CommonModule, RouterLink, JokeItem]
})
export class JokeList implements OnInit {
  jokes$!: Observable<Joke[]>;
  filterType: string = 'all';
  selectedCategory: string = '';

  constructor(
    private jokeService: JokeService,
    public userStore: UserStoreService,
    private route: ActivatedRoute
  ) {}

  /** Subscribes to route params and loads jokes based on category filter */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || '';
      this.loadJokes();
    });
  }

  /** Loads jokes filtered by category if specified, otherwise shows all jokes */
  loadJokes(): void {
    // Reset filter type when loading by category
    this.filterType = 'all';

    if (this.selectedCategory) {
      this.jokes$ = this.jokeService.getJokes().pipe(
        map(jokes => jokes.filter(joke => joke.type === this.selectedCategory))
      );
    } else {
      this.jokes$ = this.jokeService.getJokes();
    }
  }

  /** Handles favorite toggle */
  onFavoriteToggled(joke: Joke) {
    const newFavoriteState = !joke.favorite;
    joke.favorite = newFavoriteState;

    this.jokeService.toggleFavorite(joke, newFavoriteState).subscribe({
      next: (response) => {
        console.log(response.msg);
      },
      error: (error) => {
        console.error('Error toggling favorite:', error);
        // Revert on error
        joke.favorite = !newFavoriteState;
      }
    });
  }

  /** Filters to show only favorite jokes */
  showFavorites() {
    this.filterType = 'favorites';
    this.selectedCategory = '';
    this.jokes$ = this.jokeService.getJokes().pipe(
      map(jokes => jokes.filter(joke => joke.favorite))
    );
  }

  /** Resets filters to show all jokes */
  showAll() {
    this.filterType = 'all';
    this.jokes$ = this.jokeService.getJokes();
  }
}
