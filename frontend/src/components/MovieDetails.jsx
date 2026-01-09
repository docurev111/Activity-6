import { useState, useEffect } from 'react';
import { getMovie, getMovieReviews, createReview, deleteReview } from '../services/api';
import './MovieDetails.css';

function MovieDetails({ movieId, onBack }) {
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    comment: '',
    rating: 5,
  });

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      const [movieRes, reviewsRes] = await Promise.all([
        getMovie(movieId),
        getMovieReviews(movieId),
      ]);
      setMovie(movieRes.data);
      setReviews(reviewsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        ...reviewForm,
        movieId: parseInt(movieId),
      });
      setReviewForm({ userName: '', comment: '', rating: 5 });
      setShowReviewForm(false);
      fetchMovieDetails();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
        fetchMovieDetails();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!movie) return <div className="error">Movie not found</div>;

  return (
    <div className="movie-details">
      <button className="btn-back" onClick={onBack}>← Back to Movies</button>
      
      <div className="movie-header">
        <h1>{movie.title}</h1>
        <p className="movie-meta">{movie.genre} • {movie.releaseYear}</p>
        <p className="movie-full-description">{movie.description}</p>
        
        <div className="rating-summary">
          <div className="rating-display">
            <div className="rating-stars-display">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= Math.round(parseFloat(calculateAverageRating())) ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="rating-number">{calculateAverageRating()}</span>
          </div>
          <p className="review-count">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
        </div>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Reviews</h2>
          <button className="btn-add-review" onClick={() => setShowReviewForm(!showReviewForm)}>
            {showReviewForm ? 'Cancel' : '+ Add Review'}
          </button>
        </div>

        {showReviewForm && (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                value={reviewForm.userName}
                onChange={(e) => setReviewForm({ ...reviewForm, userName: e.target.value })}
                required
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label>Rating *</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${reviewForm.rating >= star ? 'active' : ''}`}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Your Review *</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                required
                rows="4"
                placeholder="Write your review here..."
              />
            </div>

            <button type="submit" className="btn-submit-review">Submit Review</button>
          </form>
        )}

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div>
                    <h4>{review.userName}</h4>
                    <div className="review-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`star ${star <= review.rating ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="rating-text">{review.rating}/5</span>
                    </div>
                  </div>
                  <button 
                    className="btn-delete-review" 
                    onClick={() => handleDeleteReview(review.id)}
                    title="Delete review"
                  >
                    ×
                  </button>
                </div>
                <p className="review-comment">{review.comment}</p>
                <p className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
