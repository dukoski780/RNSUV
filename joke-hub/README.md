# JokeHub - Angular Joke Sharing Platform

Angular 19 web application for sharing and managing jokes. Users can register, login, add jokes, mark favorites, manage their account, and admins can import jokes from an external API.

## Project Overview

This project demonstrates the main Angular mechanisms required for a university project (RNSUV course), using Angular 19 standalone architecture with Bootstrap 5 styling.

## Angular Concepts Demonstrated

### 1. Data Binding
- **Interpolation**: `{{ joke.setup }}`, `{{ userStore.username }}`
- **Property binding**: `[disabled]="!loginForm.form.valid"`, `[routerLink]="['/jokes/edit', joke.id]"`
- **Event binding**: `(click)="toggleFavorite()"`, `(submit)="changePassword()"`
- **Two-way binding**: `[(ngModel)]="username"` in forms

### 2. Input/Output
- `joke-item` component receives jokes via `@Input()`
- Emits events via `@Output()` to parent component
- Parent-child component communication

### 3. Structural & Attribute Directives
- **Structural directives**:
  - `*ngFor`: Loop through jokes list
  - `*ngIf`: Conditional rendering and empty states
  - `*ngIf-else`: Alternative templates
- **Attribute directives**:
  - `[ngClass]`: Dynamic CSS classes for favorites and alerts
  - `[class.active]`: Conditional class binding

### 4. Template-Driven Forms (TDF)
- Login form with validation
- Registration form with password matching
- Create/Edit joke forms with required fields
- My Account password change form
- Uses `FormsModule`, `ngModel`, and template reference variables

### 5. Models/Interfaces
- `Joke` interface - defines joke structure
- `User` interface - defines user structure
- TypeScript interfaces for type safety

### 6. Angular Services
- `JokeService`: CRUD operations for jokes, state management with BehaviorSubject
- `UserStoreService`: JWT token and user state management
- `TokenInterceptor`: Automatically adds JWT to API requests
- Dependency injection throughout the app

### 7. Observables & RxJS
- HTTP requests return Observables
- `BehaviorSubject` for reactive state management
- `AsyncPipe` for automatic subscriptions in templates
- RxJS operators: `map`, `tap`, `switchMap`, `pipe`

### 8. Routing
- Multiple routes with route parameters (`:id`)
- Protected routes with `authGuard` (requires login)
- Admin-only routes with `adminGuard`
- Navigation with `RouterLink` and programmatic routing

### 9. JWT & HTTP Interceptors
- Real JWT token generation on login (backend)
- `tokenInterceptor` adds tokens to HTTP headers automatically
- Token stored in localStorage
- Automatic authentication for protected endpoints

## Installation & Setup

**Both backend and frontend servers must be running!**

### Step 1: Start the Backend Server

```bash
cd joke-hub-server
npm install
node index.js
```

Server runs on: **http://localhost:3001**

### Step 2: Start the Angular Frontend

Open a new terminal:

```bash
cd joke-hub
npm install
ng serve
```

Frontend runs on: **http://localhost:4200**

The Angular dev server automatically proxies `/api/*` requests to the backend.

## Demo Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | admin (full access) |
| `user1` | `pass123` | user |

## Application Routes

| Route | Description | Protection |
|-------|-------------|------------|
| `/login` | Login page | Public |
| `/register` | Registration page | Public |
| `/jokes/list` | View all jokes | Public |
| `/jokes/detail/:id` | View joke details | Public |
| `/jokes/create` | Add new joke | Protected |
| `/jokes/edit/:id` | Edit joke | Protected |
| `/my-account` | Account management | Protected |
| `/admin/import` | Import jokes | Admin only |

## Features

### User Features
- Register and login
- View all jokes with filtering by category
- Add new jokes
- Edit/delete your own jokes
- Mark jokes as favorites
- View joke details with view counter
- Change password

### Admin Features
- All user features
- Import jokes from Official Joke API
- Delete any joke

## Project Structure

```
joke-hub/
├── src/app/
│   ├── models/
│   │   ├── joke.ts
│   │   └── user.ts
│   ├── services/
│   │   ├── user-store.service.ts
│   │   ├── joke.service.ts
│   │   └── token.interceptor.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── admin.guard.ts
│   ├── user/
│   │   ├── login/
│   │   ├── register/
│   │   └── my-account/
│   ├── jokes/
│   │   ├── joke-list/
│   │   ├── joke-item/
│   │   ├── joke-detail/
│   │   ├── create-joke/
│   │   └── edit-joke/
│   ├── admin/
│   │   └── import-jokes/
│   └── shared/components/header/
├── proxy.conf.json
└── angular.json
```

## Project Statistics

- **Components**: 11 (Login, Register, My Account, Joke List, Joke Item, Joke Detail, Create Joke, Edit Joke, Import Jokes, Header, App)
- **Services**: 3 (JokeService, UserStoreService, TokenInterceptor)
- **Routes**: 9
- **Guards**: 2 (authGuard, adminGuard)

## Technologies

### Frontend
- Angular 19
- TypeScript 5
- Bootstrap 5

### Backend
- Node.js
- JSON Web Token (JWT)

## Related

- Backend: `joke-hub-server/`
