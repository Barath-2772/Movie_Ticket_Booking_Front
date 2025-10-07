import React from 'react';
import './MovieCard.css';

function MovieCard({ movie, onMovieSelect }) { // Receive the function
  if (!movie) {
    return null;
  }

  return (
    // Add the onClick event to the main div
    
    <div className="movie-card" onClick={() => onMovieSelect(movie.id)}>

      <div className="poster-container">
        
        <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
        <div className="poster-overlay">
          
          <span>👍 {movie.likes}</span>
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-genre">{movie.genre}</p>
      </div>
    </div>
  );
}

export default MovieCard;