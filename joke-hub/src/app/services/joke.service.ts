import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Joke } from '../models/joke';
import { UserStoreService } from './user-store.service';

/**
 * Service for managing jokes - handles CRUD operations and state management
 */
@Injectable({
  providedIn: 'root'
})
export class JokeService {
  private apiUrl = '/api/joke';
  private jokesSubject = new BehaviorSubject<Joke[]>([]);
  public jokes$ = this.jokesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private userStore: UserStoreService
  ) {
    this.loadJokes();
  }

  /** Loads all jokes from the API and updates the jokes subject */
  private loadJokes(): void {
    // Load jokes publicly (no authentication required for viewing)
    this.http.get<Joke[]>(this.apiUrl).subscribe({
      next: jokes => this.jokesSubject.next(jokes),
      error: error => console.error('Error loading jokes:', error)
    });
  }

  /** Triggers a reload and returns the observable of all jokes */
  getJokes(): Observable<Joke[]> {
    this.loadJokes();
    return this.jokes$;
  }

  /** Fetches a single joke by its ID */
  getJokeById(id: number): Observable<Joke> {
    return this.http.get<Joke>(`${this.apiUrl}/${id}`);
  }

  /** Creates a new joke with the given details */
  addJoke(type: string, setup: string, punchline: string): Observable<{ msg: string; id: number }> {
    const newJoke = {
      type: type,
      setup: setup,
      punchline: punchline,
      author: this.userStore.username
    };

    return this.http.post<{ msg: string; id: number }>(this.apiUrl, newJoke).pipe(
      tap(() => this.loadJokes())
    );
  }

  /** Updates an existing joke */
  updateJoke(id: number, type: string, setup: string, punchline: string): Observable<{ msg: string; joke: Joke }> {
    return this.http.put<{ msg: string; joke: Joke }>(`${this.apiUrl}/${id}`, {
      type: type,
      setup: setup,
      punchline: punchline
    }).pipe(
      tap(() => this.loadJokes())
    );
  }

  /** Toggles the favorite status of a joke */
  toggleFavorite(joke: Joke, newState: boolean): Observable<{ msg: string }> {
    return this.http.patch<{ msg: string }>(`${this.apiUrl}/${joke.id}`, {
      favorite: newState
    });
  }

  /** Imports multiple jokes from external source */
  importJokes(jokes: Joke[]): Observable<{ msg: string; count: number }> {
    return this.http.post<{ msg: string; count: number }>(`${this.apiUrl}/import`, {
      jokes: jokes
    }).pipe(
      tap(() => this.loadJokes())
    );
  }

  /** Increments the view count for a joke */
  incrementView(id: number): Observable<{ msg: string; views: number }> {
    return this.http.patch<{ msg: string; views: number }>(`${this.apiUrl}/${id}/view`, {});
  }

  /** Deletes a joke by ID */
  deleteJoke(id: number): Observable<{ msg: string; id: number }> {
    return this.http.delete<{ msg: string; id: number }>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadJokes())
    );
  }
}
