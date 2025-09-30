import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../MovieCard/MovieCard.jsx'; // Corrected path
import './MovieList.css';

function MovieList({ cityId, onMovieSelect }) { // Receive props
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (cityId) { // Only fetch if a city is selected
      axios.get(`https://movieshow.up.railway.app/api/movies/by-city/${cityId}`)
        .then(response => {
          setMovies(response.data);
        })
        .catch(error => console.error("Error fetching movies:", error));
    } else {
      setMovies([]); // Clear movies if no city is selected
    }
  }, [cityId]); // Re-run whenever cityId changes

  return (
    <div className="movie-list-container">
      <h2>Recommended Movies</h2>
      {cityId ? (
        <div className="movie-grid">
          {movies.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onMovieSelect={onMovieSelect} // Pass the function down
            />
          ))}
        </div>
      ) : (
        <p>Please select a city to see the movies.</p>
      )}
    </div>
  );
}

export default MovieList;