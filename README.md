# ReviewFilms - Movie Review Application

A full-stack web application for browsing movies, writing reviews, and rating films.

## Features

- Browse and search movies
- View detailed movie information
- Add new movies to the database
- Write and submit reviews
- Rate movies from 1 to 5 stars
- View calculated average ratings
- Delete reviews

## Technology Stack

### Backend
- Node.js with NestJS framework
- TypeScript
- SQLite database
- TypeORM for data management
- Swagger API documentation

### Frontend
- React with Vite
- Axios for API requests
- Modern CSS styling

## Installation

### Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

Backend runs on: http://localhost:3000
API documentation: http://localhost:3000/api

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

## API Endpoints

### Movies
- GET /movies - Get all movies
- GET /movies/:id - Get movie by ID
- POST /movies - Create new movie
- PATCH /movies/:id - Update movie
- DELETE /movies/:id - Delete movie
- GET /movies/:id/rating - Get movie average rating

### Reviews
- GET /reviews - Get all reviews
- GET /reviews/movie/:movieId - Get reviews for a movie
- POST /reviews - Create new review
- DELETE /reviews/:id - Delete review

## Usage

1. Start the backend server
2. Start the frontend development server
3. Open http://localhost:5173 in your browser
4. Browse movies, add reviews, and explore the application

## Project Structure

```
Activity 6/
 backend/
    src/
       entities/
       movies/
       reviews/
       main.ts
    package.json
 frontend/
     src/
        components/
        services/
        App.jsx
     package.json
```

## License

MIT
