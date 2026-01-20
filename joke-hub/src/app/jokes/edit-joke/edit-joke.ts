import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JokeService } from '../../services/joke.service';
import { Joke } from '../../models/joke';

@Component({
  selector: 'app-edit-joke',
  templateUrl: './edit-joke.html',
  styleUrl: './edit-joke.css',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink]
})
export class EditJoke implements OnInit {
  jokeId: number = 0;
  jokeType: string = '';
  setup: string = '';
  punchline: string = '';
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = true;

  jokeTypes: string[] = ['general', 'programming', 'knock-knock', 'dad'];

  constructor(
    private jokeService: JokeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.jokeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadJoke();
  }

  loadJoke() {
    this.jokeService.getJokeById(this.jokeId).subscribe({
      next: (joke: Joke) => {
        this.jokeType = joke.type;
        this.setup = joke.setup;
        this.punchline = joke.punchline;
        this.isLoading = false;
      },
      error: (error) => {
        this.message = 'Failed to load joke';
        this.isError = true;
        this.isLoading = false;
      }
    });
  }

  updateJoke() {
    this.message = '';
    this.isError = false;

    this.jokeService.updateJoke(this.jokeId, this.jokeType, this.setup, this.punchline).subscribe({
      next: (response) => {
        this.message = response.msg;
        this.isError = false;
        setTimeout(() => {
          this.router.navigate(['/jokes/list']);
        }, 1000);
      },
      error: (error) => {
        this.message = error.error?.msg || 'Failed to update joke';
        this.isError = true;
      }
    });
  }
}
