import { useState } from 'react';
import { createMovie } from '../services/api';
import './AddMovieForm.css';

function AddMovieForm({ onClose, onMovieAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'releaseYear' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMovie(formData);
      onMovieAdded();
      onClose();
    } catch (error) {
      console.error('Error creating movie:', error);
      alert('Failed to create movie. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Movie</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter film title"
            />
          </div>

          <div className="form-group">
            <label>Genre *</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
              placeholder="e.g., Action, Drama, Comedy"
            />
          </div>

          <div className="form-group">
            <label>Release Year *</label>
            <input
              type="number"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleChange}
              required
              min="1888"
              max="2100"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Enter film description"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Add Movie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMovieForm;
