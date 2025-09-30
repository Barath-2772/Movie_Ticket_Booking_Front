import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShowList.css';

// The component now accepts a new prop: onShowSelect
function ShowList({ cityId, movieId, onShowSelect }) {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    // This code runs whenever the cityId or movieId changes
    if (cityId && movieId) {
      axios.get(`https://movieshow.up.railway.app/api/cities/${cityId}/movies/${movieId}/shows`)
        .then(response => {
          setShows(response.data);
        })
        .catch(error => {
          console.error('Error fetching shows!', error);
        });
    }
  }, [cityId, movieId]);

  return (
    <div className="show-list-container">
      <h3>Showtimes</h3>
      {shows.length > 0 ? (
        <ul className="show-list">
          {shows.map(show => (
            // Add the onClick event to the list item to make it clickable
            <li key={show.id} className="show-item" onClick={() => onShowSelect(show)}>
              <div className="theater-name">{show.theaterName}</div>
              <div className="show-time">
                {new Date(show.showTime).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No showtimes available for this movie.</p>
      )}
    </div>
  );
}

export default ShowList;