import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (event) => {
    event.preventDefault(); // Prevents the form from reloading the page
    
    const loginRequest = {
      email: email,
      password: password
    };

    axios.post('https://movieshow.up.railway.app/api/auth/login', loginRequest)
      .then(response => {
        setError('');
        // Send the user data back to the App component on success
        onLoginSuccess(response.data);
      })
      .catch(err => {
        console.error('Login failed!', err);
        setError('Invalid credentials. Please try again.');
      });
  };

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;