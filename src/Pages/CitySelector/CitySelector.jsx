import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CitySelector.css';

function CitySelector({ onCitySelect }) { // Receive the function as a prop
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios.get('https://movieshow.up.railway.app/api/cities/get_cities')
      .then(response => {
        setCities(response.data);
      })
      .catch(error => console.error('Error fetching cities:', error));
  }, []);

  return (
    // Call onCitySelect when the value changes
    <select className="city-select" onChange={(e) => onCitySelect(e.target.value)}>
      <option value="">Select City</option>
      {cities.map(city => (
        <option key={city.id} value={city.id}>{city.name}</option>
      ))}
    </select>
  );
}

export default CitySelector;