# Movie Review App - Frontend

A modern, responsive movie review application built with React and Vite.

## Features

- **Browse Movies**: View all movies with ratings and reviews
- **Movie Details**: Detailed view of each movie with all reviews
- **Add Movies**: Create new movie entries
- **Write Reviews**: Add reviews and ratings (1-5 stars)
- **Average Ratings**: Visual display of average ratings per movie
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean and intuitive user interface

## Technologies Used

- **React**: UI library
- **Vite**: Build tool and dev server
- **Axios**: HTTP client for API calls
- **CSS3**: Styling with modern features

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://localhost:3000`

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
 components/         # React components
    MovieList.jsx
    MovieList.css
    MovieDetails.jsx
    MovieDetails.css
    AddMovieForm.jsx
    AddMovieForm.css
 services/          # API services
    api.js
 App.jsx           # Main app component
 App.css          # App styles
 index.css        # Global styles
 main.jsx        # App entry point
```

## Features Overview

### Movie List
- Grid layout of all movies
- Star ratings display
- Review count
- Quick actions (View, Delete)
- Add new movie button

### Movie Details
- Complete movie information
- Average rating calculation
- All reviews displayed
- Add review form
- Delete reviews

### Add Movie Form
- Title, genre, release year
- Description
- Form validation
- Modal interface

### Review System
- Star rating selector (1-5)
- User name and comment
- Date display
- Delete functionality

## API Integration

The frontend communicates with the backend API at `http://localhost:3000`:

- `GET /movies` - Fetch all movies
- `GET /movies/:id` - Fetch movie details
- `POST /movies` - Create new movie
- `DELETE /movies/:id` - Delete movie
- `GET /reviews/movie/:movieId` - Fetch movie reviews
- `POST /reviews` - Create new review
- `DELETE /reviews/:id` - Delete review

## Styling

The app uses a modern color scheme with:
- Purple gradient background
- Clean white cards
- Intuitive button colors (green for add, blue for view, red for delete)
- Hover effects and transitions
- Responsive grid layouts

## License

MIT
