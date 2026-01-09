import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Movie APIs
export const getMovies = () => api.get('/movies');
export const getMovie = (id) => api.get(`/movies/${id}`);
export const createMovie = (movieData) => api.post('/movies', movieData);
export const updateMovie = (id, movieData) => api.patch(`/movies/${id}`, movieData);
export const deleteMovie = (id) => api.delete(`/movies/${id}`);
export const getMovieRating = (id) => api.get(`/movies/${id}/rating`);

// Review APIs
export const getReviews = () => api.get('/reviews');
export const getMovieReviews = (movieId) => api.get(`/reviews/movie/${movieId}`);
export const createReview = (reviewData) => api.post('/reviews', reviewData);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

export default api;
