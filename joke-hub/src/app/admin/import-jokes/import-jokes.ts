import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExternalJokeService } from '../../services/external-joke.service';
import { JokeService } from '../../services/joke.service';

/**
 * Component for importing jokes from the Official Joke API (admin only)
 */
@Component({
  selector: 'app-import-jokes',
  templateUrl: './import-jokes.html',
  styleUrl: './import-jokes.css',
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class ImportJokes {
  isLoading: boolean = false;
  message: string = '';
  isError: boolean = false;
  importedCount: number = 0;

  constructor(
    private externalJokeService: ExternalJokeService,
    private jokeService: JokeService
  ) {}

  /** Imports random jokes from various categories */
  importRandomJokes(count: number) {
    this.isLoading = true;
    this.message = '';
    this.isError = false;

    this.externalJokeService.getMultipleRandomJokes(count).subscribe({
      next: (jokes) => {
        this.jokeService.importJokes(jokes).subscribe({
          next: (response) => {
            this.message = `Successfully imported ${response.count} jokes!`;
            this.importedCount += response.count;
            this.isError = false;
            this.isLoading = false;
          },
          error: (error) => {
            this.message = 'Failed to save imported jokes';
            this.isError = true;
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        this.message = 'Failed to fetch jokes from external API';
        this.isError = true;
        this.isLoading = false;
      }
    });
  }

  /** Imports jokes from a specific category (programming, general, knock-knock) */
  importJokesByCategory(category: string, count: number) {
    this.isLoading = true;
    this.message = '';
    this.isError = false;

    this.externalJokeService.getJokesByType(category, count).subscribe({
      next: (jokes) => {
        this.jokeService.importJokes(jokes).subscribe({
          next: (response) => {
            this.message = `Successfully imported ${response.count} ${category} jokes!`;
            this.importedCount += response.count;
            this.isError = false;
            this.isLoading = false;
          },
          error: (error) => {
            this.message = 'Failed to save imported jokes';
            this.isError = true;
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        this.message = `Failed to fetch ${category} jokes from external API`;
        this.isError = true;
        this.isLoading = false;
      }
    });
  }
}
