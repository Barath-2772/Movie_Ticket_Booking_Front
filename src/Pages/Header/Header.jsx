import React from 'react';
import './Header.css';
import CitySelector from '../CitySelector/CitySelector';

// Receive user, onSignOut, onShowBookings, and onGoHome as props
function Header({ user, onCitySelect, onSignOut, onShowBookings, onGoHome }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo" onClick={onGoHome} style={{cursor: 'pointer'}}>bookmyshow</div>
      </div>
      <div className="header-right">
        {user ? (
          <>
            <CitySelector onCitySelect={onCitySelect} />
            <button className="nav-button" onClick={onShowBookings}>My Bookings</button>
            <span className="user-name">Hi, {user.name}</span>
            <button className="sign-in-btn" onClick={onSignOut}>Sign Out</button>
          </>
        ) : (
          <button className="sign-in-btn">Sign In</button>
        )}
        <div className="menu-icon">☰</div>
      </div>
    </header>
  );
}

export default Header;