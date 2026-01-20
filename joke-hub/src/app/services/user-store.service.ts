import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private _token: string = '';
  private _username: string = '';
  private _role: 'user' | 'admin' | '' = '';

  constructor() {
    this._token = localStorage.getItem('jokeHubToken') || '';
    this._username = localStorage.getItem('jokeHubUsername') || '';
    this._role = (localStorage.getItem('jokeHubRole') as 'user' | 'admin') || '';
  }

  set token(token: string) {
    this._token = token;
    if (token) {
      localStorage.setItem('jokeHubToken', token);
    } else {
      localStorage.removeItem('jokeHubToken');
    }
  }

  get token(): string {
    return this._token;
  }

  set username(username: string) {
    this._username = username;
    if (username) {
      localStorage.setItem('jokeHubUsername', username);
    } else {
      localStorage.removeItem('jokeHubUsername');
    }
  }

  get username(): string {
    return this._username;
  }

  set role(role: 'user' | 'admin' | '') {
    this._role = role;
    if (role) {
      localStorage.setItem('jokeHubRole', role);
    } else {
      localStorage.removeItem('jokeHubRole');
    }
  }

  get role(): 'user' | 'admin' | '' {
    return this._role;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  logout(): void {
    this.token = '';
    this.username = '';
    this.role = '';
  }
}
