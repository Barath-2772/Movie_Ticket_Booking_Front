import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyBookingsPage.css';

function MyBookingsPage({ user }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get(`https://movieshow.up.railway.app/api/bookings/by-user/${user.id}`)
        .then((response) => {
          console.log("Bookings data:", response.data); // Debugging
          setBookings(response.data);
        })
        .catch((error) => console.error("Error fetching bookings:", error));
    }
  }, [user]);

  return (
    <div className="my-bookings-page">
      <h2>My Bookings</h2>
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <div key={booking.bookingId} className="booking-card">
            <h4>{booking.movieTitle || "Unknown Movie"}</h4>
            <p><span>Theater:</span> {booking.theaterName || "Unknown Theater"}</p>
            <p>
              <span>Time:</span>{" "}
              {booking.showTime
                ? new Date(booking.showTime).toLocaleString()
                : "N/A"}
            </p>
            <p>
              <span>Seats:</span>{" "}
              {booking.seats?.length > 0
                ? booking.seats.join(", ")
                : "No seats"}
            </p>
            <p>
              <span>Booking ID:</span>{" "}
              <span className="booking-id-badge">{booking.bookingId}</span>
            </p>
          </div>
        ))
      ) : (
        <p className="no-bookings">You have no bookings.</p>
      )}
    </div>
  );
}

export default MyBookingsPage;
