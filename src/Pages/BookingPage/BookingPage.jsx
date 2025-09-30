import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingPage.css';

const seats = ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'C1', 'C2', 'C3', 'C4', 'C5'];

function BookingPage({ show, user, onGoBack }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    if (show) {
      axios.get(`http://localhost:8080/api/shows/${show.id}/booked-seats`)
        .then(response => {
          setBookedSeats(response.data);
        })
        .catch(error => console.error("Error fetching booked seats:", error));
    }
  }, [show]);

  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }
    const bookingRequest = {
      showId: show.id,
      userId: user.id,
      seatNumbers: selectedSeats
    };
    axios.post('https://movieshow.up.railway.app/api/bookings', bookingRequest)
      .then(response => {
        alert(`Booking successful! Your booking ID is: ${response.data.id}\nSeats: ${selectedSeats.join(', ')}`);
        onGoBack(); // Go back after successful booking
      })
      .catch(error => {
        console.error('There was an error making the booking!', error);
        alert('Booking failed!');
      });
  };

  return (
    <div className="booking-page">
      <button onClick={onGoBack} className="back-btn">
        &larr; Back to Showtimes
      </button>
      <h2>Booking for: {show.movieTitle}</h2>
      <h4>At: {show.theaterName} on {new Date(show.showTime).toLocaleDateString()}</h4>
      <hr />
      <h3>Select Your Seats</h3>
      <div className="seat-map">
        {seats.map(seat => {
          const isBooked = bookedSeats.includes(seat);
          const isSelected = selectedSeats.includes(seat);
          return (
            <button 
              key={seat} 
              onClick={() => handleSeatClick(seat)}
              className={`seat ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
              disabled={isBooked}
            >
              {seat}
            </button>
          );
        })}
      </div>
      <div className="screen">SCREEN</div>
      <hr />
      <p>Selected Seats: {selectedSeats.join(', ')}</p>
      <button onClick={handleConfirmBooking} className="confirm-btn">
        Confirm Booking for {user.name}
      </button>
    </div>
  );
}

export default BookingPage;