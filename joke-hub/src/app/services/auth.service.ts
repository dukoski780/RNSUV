import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserStoreService } from './user-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/user';

  constructor(
    private http: HttpClient,
    private userStore: UserStoreService
  ) {}

  login(username: string, password: string): Observable<{ msg: string; token: string; role: string }> {
    return this.http.post<{ msg: string; token: string; role: string }>(`${this.apiUrl}/login`, {
      username: username,
      password: password
    }).pipe(
      tap(response => {
        this.userStore.token = response.token;
        this.userStore.username = username;
        this.userStore.role = response.role as 'user' | 'admin';
      })
    );
  }

  register(username: string, password: string): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.apiUrl}/register`, {
      username: username,
      password: password
    });
  }

  logout(): void {
    this.userStore.logout();
  }
}
