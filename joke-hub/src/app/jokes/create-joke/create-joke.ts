import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JokeService } from '../../services/joke.service';

/**
 * Component for creating new jokes
 */
@Component({
  selector: 'app-create-joke',
  templateUrl: './create-joke.html',
  styleUrl: './create-joke.css',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink]
})
export class CreateJoke {
  jokeType: string = 'general';
  setup: string = '';
  punchline: string = '';
  message: string = '';
  isError: boolean = false;

  jokeTypes: string[] = ['general', 'programming', 'knock-knock', 'dad'];

  constructor(
    private jokeService: JokeService,
    private router: Router
  ) {}

  /** Creates a new joke and navigates to the jokes list on success */
  createJoke() {
    if (!this.setup || !this.punchline) {
      this.message = 'Please fill in all fields';
      this.isError = true;
      return;
    }

    this.jokeService.addJoke(this.jokeType, this.setup, this.punchline).subscribe({
      next: (response) => {
        this.message = response.msg;
        this.isError = false;
        setTimeout(() => {
          this.router.navigate(['/jokes/list']);
        }, 1000);
      },
      error: (error) => {
        this.message = 'Failed to add joke';
        this.isError = true;
      }
    });
  }
}
