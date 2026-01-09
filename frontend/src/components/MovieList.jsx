import { useState, useEffect } from 'react';
import { getMovies, deleteMovie } from '../services/api';
import './MovieList.css';

function MovieList({ onSelectMovie, onAddMovie }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await getMovies();
      setMovies(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteMovie(id);
        fetchMovies();
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) return <div className="loading">Loading movies...</div>;

  return (
    <div className="movie-list">
      <div className="movie-list-header">
        <h2>Movies</h2>
        <button className="btn-add" onClick={onAddMovie}>+ Add Movie</button>
      </div>
      
      {movies.length === 0 ? (
        <p className="no-movies">No movies yet. Add your first movie!</p>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <h3>{movie.title}</h3>
              <p className="movie-genre">{movie.genre} • {movie.releaseYear}</p>
              <p className="movie-description">{movie.description}</p>
              <div className="movie-rating">
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= Math.round(calculateAverageRating(movie.reviews)) ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="rating-value">{calculateAverageRating(movie.reviews)}</span>
                <span className="review-count">({movie.reviews?.length || 0} {movie.reviews?.length === 1 ? 'review' : 'reviews'})</span>
              </div>
              <div className="movie-actions">
                <button className="btn-view" onClick={() => onSelectMovie(movie.id)}>
                  View Details
                </button>
                <button className="btn-delete" onClick={() => handleDelete(movie.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieList;
