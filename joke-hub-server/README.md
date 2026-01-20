# JokeHub Server

Backend REST API server for the JokeHub Angular application built with Express.js and Node.js.

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
```

Server runs on: **http://localhost:3001**

## Implemented Features

### User Authentication
- Login with JWT token generation
- Registration with automatic user creation
- Password change functionality
- Role-based access control (admin/user)

### Joke Management
- CRUD operations (Create, Read, Update, Delete)
- Favorite toggle functionality
- View counter tracking
- Bulk import from external API (Official Joke API)
- Duplicate prevention on import

### Data Persistence
- File-based JSON storage in `database/` folder
- Automatic ID generation and tracking
- Data survives server restarts

## Default Users

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | admin |
| `user1` | `pass123` | user |

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user/login` | Login (returns JWT token) |
| POST | `/api/user/register` | Register new user |
| GET | `/api/joke` | Get all jokes |
| GET | `/api/joke/:id` | Get joke by ID |
| PATCH | `/api/joke/:id/view` | Increment view count |

### Protected Endpoints (requires JWT token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/joke` | Create new joke |
| PUT | `/api/joke/:id` | Update joke |
| DELETE | `/api/joke/:id` | Delete joke (admin only) |
| PATCH | `/api/joke/:id/favorite` | Toggle favorite |
| POST | `/api/joke/import` | Import jokes from external API (admin only) |
| PUT | `/api/user/password` | Change password |

## JWT Authentication

The server uses JSON Web Tokens for authentication:

1. User logs in with credentials
2. Server validates against `database/users.json`
3. Server generates JWT with payload: `{ user: username, role: role }`
4. Token returned to client
5. Client includes token in subsequent requests via `Authorization: Bearer <token>` header

## Authorization Levels

| Level | Description | Example Endpoints |
|-------|-------------|-------------------|
| Public | Anyone can access | GET jokes, view count |
| Authenticated | Any logged-in user | POST jokes, toggle favorites |
| Owner or Admin | Joke author or admin | PUT edit joke |
| Admin Only | Only admin role | DELETE jokes, POST import |

## Data Storage

All data is stored in JSON files in the `database/` directory:

| File | Purpose |
|------|---------|
| `users.json` | User credentials and roles |
| `jokes.json` | All jokes with metadata (author, views, favorite, timestamps) |
| `jokes_index.json` | Tracks last used joke ID for auto-increment |

## External API Integration

Jokes can be imported from the [Official Joke API](https://official-joke-api.appspot.com):
- Random jokes
- Programming jokes
- Jokes by category (general, knock-knock, dad jokes)

The import feature checks for duplicates before saving.

## File Structure

```
joke-hub-server/
├── database/
│   ├── jokes.json
│   ├── users.json
│   └── jokes_index.json
├── index.js          # Main server, middleware, CORS
├── user.js           # User routes (login, register, password)
├── jokes.js          # Joke routes (CRUD, import)
└── package.json
```

## Technologies

- Node.js
- Express.js
- JSON Web Token (JWT)

## Related

- Frontend: `joke-hub/` - Angular application
