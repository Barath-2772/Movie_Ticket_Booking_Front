import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import "./BookingPage.css";

const seatLayoutConfig = {
  elite: {
    price: 350.0,
    rows: [
      {
        rowId: "A",
        seats: [
          { num: "01" }, { num: "02" }, { type: "spacer" },
          { num: "03" }, { num: "04" }, { num: "05" }, { num: "06" },
          { type: "spacer" }, { num: "07" }, { num: "08" },
        ],
      },
      {
        rowId: "B",
        seats: [
          { num: "01" }, { num: "02" }, { type: "spacer" },
          { num: "03" }, { num: "04" }, { num: "05" }, { num: "06" },
          { type: "spacer" }, { num: "07" }, { num: "08" },
        ],
      },
    ],
  },
  premium: {
    price: 280.0,
    rows: ["C", "D", "E", "F"].map(rowId => ({
      rowId,
      seats: [
        { num: "01" }, { num: "02" }, { num: "03" }, { num: "04" },
        { type: "spacer" },
        { num: "05" }, { num: "06" }, { num: "07" }, { num: "08" }, { num: "09" }, { num: "10" },
        { type: "spacer" },
        { num: "11" }, { num: "12" }, { num: "13" }, { num: "14" }
      ],
    }))
  },
  standard: {
    price: 180.0,
    rows: ["G", "H", "I"].map(rowId => ({
      rowId,
      seats: [
        { num: "01" }, { num: "02" }, { num: "03" }, { num: "04" },
        { type: "spacer" },
        { num: "05" }, { num: "06" }, { num: "07" }, { num: "08" }, { num: "09" }, { num: "10" },
        { type: "spacer" },
        { num: "11" }, { num: "12" }, { num: "13" }, { num: "14" }
      ],
    }))
  },
};

const showtimes = ["09:00 AM", "12:30 PM", "04:00 PM", "07:30 PM", "11:00 PM"];

function BookingPage({ show, user, onGoBack }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  // Default ticket count set to 1
  const [ticketCount, setTicketCount] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedShowtime, setSelectedShowtime] = useState(showtimes[1]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial ticket selection popup state
  const [showPopup, setShowPopup] = useState(true);
  // NEW: State for the "Add more seats?" confirmation popup
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  useEffect(() => {
    if (!show?.id) return;
    setLoading(true);

    axios.get(`https://movieshow.up.railway.app/api/shows/${show.id}/booked-seats`, {
      params: { time: selectedShowtime }
    })
      .then(res => setBookedSeats(res.data || []))
      .catch(err => {
        console.error("Error fetching seats:", err);
        setBookedSeats([]);
      })
      .finally(() => setLoading(false));
  }, [show?.id, selectedShowtime]);

  const allSeatIds = useMemo(() => {
    return Object.values(seatLayoutConfig).flatMap(section =>
      section.rows.flatMap(row =>
        row.seats.filter(seat => seat.num).map(seat => `${row.rowId}${seat.num}`)
      )
    );
  }, []);

  const allSeatsBooked = useMemo(() =>
    allSeatIds.every(seatId => bookedSeats.includes(seatId)),
    [allSeatIds, bookedSeats]
  );

  const handleSeatClick = useCallback((seatId) => {
    if (bookedSeats.includes(seatId)) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(s => s !== seatId);
      } else {
        // MODIFIED LOGIC: If count is exceeded, show the confirmation popup
        if (prev.length >= ticketCount) {
          setShowConfirmPopup(true);
          return prev; // Do not select the seat yet
        }
        return [...prev, seatId];
      }
    });
  }, [bookedSeats, ticketCount]);

  const handleConfirmBooking = useCallback(() => {
    if (selectedSeats.length !== ticketCount) {
      alert(`Please select exactly ${ticketCount} seat(s).`);
      return;
    }

    const bookingRequest = {
      showId: show.id,
      userId: user.id,
      seatNumbers: selectedSeats,
      showTime: selectedShowtime,
    };

    setIsSubmitting(true);

    axios.post("https://movieshow.up.railway.app/api/bookings", bookingRequest)
      .then(response => {
        alert(`🎉 Booking Confirmed!\nBooking ID: ${response.data.id}\nSeats: ${selectedSeats.join(", ")}`);
        onGoBack();
      })
      .catch(err => {
        console.error("Booking failed:", err);
        alert("Booking failed! Seats may be taken. Please try again.");
        setLoading(true);
        axios.get(`https://movieshow.up.railway.app/api/shows/${show.id}/${selectedShowtime}/booked-seats`)
          .then(res => {
            setBookedSeats(res.data);
            setSelectedSeats([]);
          })
          .finally(() => setLoading(false));
      })
      .finally(() => setIsSubmitting(false));
  }, [show, user, selectedSeats, selectedShowtime, ticketCount, onGoBack]);

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((total, seatId) => {
      const row = seatId.charAt(0);
      if ("AB".includes(row)) return total + seatLayoutConfig.elite.price;
      if ("CDEF".includes(row)) return total + seatLayoutConfig.premium.price;
      return total + seatLayoutConfig.standard.price;
    }, 0);
  }, [selectedSeats]);

  const renderSeats = (section) =>
    section.rows.map(({ rowId, seats }) => (
      <div className="seat-row" key={rowId}>
        <div className="row-label">{rowId}</div>
        {seats.map((seat, idx) => {
          if (seat.type === "spacer") return <div className="seat-spacer" key={`${rowId}-spacer-${idx}`} />;
          const seatId = `${rowId}${seat.num}`;
          const isBooked = bookedSeats.includes(seatId);
          const isSelected = selectedSeats.includes(seatId);
          let seatClass = "seat";
          if (isBooked) seatClass += " booked";
          if (isSelected) seatClass += " selected";

          return (
            <div
              key={seatId}
              data-seatid={seatId}
              className={seatClass}
              onClick={() => handleSeatClick(seatId)}
            >
              {seat.num}
            </div>
          );
        })}
        <div className="row-label">{rowId}</div>
      </div>
    ));

  const formattedDate = new Date(show?.showTime).toLocaleDateString(undefined, {
    day: "numeric", month: "short", year: "numeric"
  });

  return (
    <div className="booking-page-container">
      
      {/* 1. Initial Ticket Count Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2 className="popup-title">⚠️ How many seats?</h2> 

            <div className="popup-counter">
              <button onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}>-</button>
              <span>{ticketCount}</span>
              <button onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}>+</button>
            </div>

            {/* MODIFIED: Removed the dynamic ticket count number */}
            <button className="popup-btn" onClick={() => setShowPopup(false)}>
              Select Seats
            </button>
          </div>
        </div>
      )}

      {/* 2. NEW: Add More Seats Confirmation Popup */}
      {showConfirmPopup && (
        <div className="popup-overlay">
          <div className="popup-box confirmation-box">
            <h2 className="popup-title">Do you want to add more seats?</h2>
            
            <div className="confirmation-buttons">
              <button 
                className="confirm-yes" 
                onClick={() => {
                  setShowConfirmPopup(false);
                  setShowPopup(true); // Re-open the initial popup
                }}
              >
                Yes
              </button>
              <button 
                className="confirm-no" 
                onClick={() => setShowConfirmPopup(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="booking-page">
        <div className="booking-header">
          <button onClick={onGoBack} className="back-btn">&larr;</button>
          <div className="header-info">
            <h2>{show?.movieTitle || "Movie Title"}</h2>
            <p>{show?.theaterName || "Theater Name"} | {formattedDate}</p>
          </div>
        </div>

        <div className="showtime-selector">
          {showtimes.map(time => (
            <button
              key={time}
              className={`showtime-btn ${selectedShowtime === time ? 'active' : ''}`}
              onClick={() => {
                setSelectedShowtime(time);
                setSelectedSeats([]);
              }}
            >
              {time}
            </button>
          ))}
        </div>

        {/* The redundant ticket counter div has been removed */}

        <div className="seat-map-wrapper">
          <div className="seat-map" style={{ transform: `scale(${zoomLevel})` }}>
            {loading ? (
              <div className="loading-indicator">Loading Seats...</div>
            ) : allSeatsBooked ? (
              <div className="no-seats-message">😞 All seats for this showtime are booked. Please choose another time.</div>
            ) : (
              Object.entries(seatLayoutConfig).map(([key, value]) => (
                <div className="seat-section" key={key}>
                  <h4 className="section-title">{key.toUpperCase()} - ₹{value.price.toFixed(2)}</h4>
                  {renderSeats(value)}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="screen-indicator">
          <div className="screen-line"></div>
          <p>All eyes this way please!</p>
        </div>

        <div className="legend">
          <div className="legend-item"><div className="seat available-legend" /> <span>Available</span></div>
          <div className="legend-item"><div className="seat selected-legend" /> <span>Selected</span></div>
          <div className="legend-item"><div className="seat booked-legend" /> <span>Sold</span></div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="booking-summary">
            <div className="selected-info">
              <h4>{selectedSeats.length} Ticket(s)</h4>
              <p>{selectedSeats.join(", ")}</p>
            </div>
            <button
              onClick={handleConfirmBooking}
              className="confirm-btn"
              disabled={isSubmitting || selectedSeats.length !== ticketCount}
            >
              {isSubmitting ? "Booking..." : `Pay ₹${totalPrice.toFixed(2)}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingPage;