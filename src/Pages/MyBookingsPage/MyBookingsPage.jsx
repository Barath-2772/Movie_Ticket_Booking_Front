import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyBookingsPage({ user }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get(`https://movieshow.up.railway.app/api/bookings/by-user/${user.id}`)
        .then((response) => {
          console.log("Bookings data:", response.data); // Debugging line
          setBookings(response.data);
        })
        .catch((error) => console.error("Error fetching bookings:", error));
    }
  }, [user]);

  return (
  <div>
    <h2>My Bookings</h2>
    {bookings.length > 0 ? (
      bookings.map((booking) => (
        <div
          key={booking.bookingId} // use bookingId as unique key
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h4>{booking.movieTitle || "Unknown Movie"}</h4>
          <p>Theater: {booking.theaterName || "Unknown Theater"}</p>
          <p>
            Time:{" "}
            {booking.showTime
              ? new Date(booking.showTime).toLocaleString()
              : "N/A"}
          </p>
          <p>
            Seats:{" "}
            {booking.seats?.length > 0
              ? booking.seats.join(", ")
              : "No seats"}
          </p>
          <p>Booking ID: {booking.bookingId}</p>
        </div>
      ))
    ) : (
      <p>You have no bookings.</p>
    )}
  </div>
);

}

export default MyBookingsPage;
