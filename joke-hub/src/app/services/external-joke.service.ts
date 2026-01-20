import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Joke } from '../models/joke';

interface ExternalJoke {
  id?: number;
  type: string;
  setup: string;
  punchline: string;
}

/**
 * Service for fetching jokes from the Official Joke API
 */
@Injectable({
  providedIn: 'root'
})
export class ExternalJokeService {
  private apiUrl = 'https://official-joke-api.appspot.com';

  constructor(private http: HttpClient) {}

  /** Fetches a single random joke from the Official Joke API */
  getRandomJoke(): Observable<Joke> {
    return this.http.get<ExternalJoke>(`${this.apiUrl}/random_joke`).pipe(
      map(joke => this.mapToJoke(joke))
    );
  }

  /** Fetches jokes by category (programming, general, knock-knock, etc.) */
  getJokesByType(type: string, count: number = 10): Observable<Joke[]> {
    return this.http.get<ExternalJoke[]>(`${this.apiUrl}/jokes/${type}/ten`).pipe(
      map(jokes => jokes.slice(0, count).map(joke => this.mapToJoke(joke)))
    );
  }

  /** Fetches multiple random jokes */
  getMultipleRandomJokes(count: number = 10): Observable<Joke[]> {
    const requests: Observable<Joke>[] = [];
    for (let i = 0; i < count; i++) {
      requests.push(this.getRandomJoke());
    }
    return forkJoin(requests);
  }

  /** Transforms external API joke format to internal Joke interface */
  private mapToJoke(externalJoke: ExternalJoke): Joke {
    return {
      id: 0, // Will be assigned by JokeService
      type: externalJoke.type,
      setup: externalJoke.setup,
      punchline: externalJoke.punchline,
      author: 'admin',
      favorite: false,
      views: 0,
      createdAt: new Date().toISOString()
    };
  }
}
