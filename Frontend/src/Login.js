import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import './Login.css';
import Navbar from './Navbar';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/auth/login", { email, password }, { withCredentials: true });
      console.log(res);

      if (res.data.token) {
        // Update isAuthenticated using the prop callback
        setIsAuthenticated(true);

        // Save token to localStorage or wherever you store it
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('id', res.data.userDetails._id)
        localStorage.setItem('username', res.data.userDetails.username)

        // Navigate to Home Screen
        history.push('/');
      } else {
        console.error('Token is missing in the response:', res.data);
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1 className="login-title">Welcome to SUpotify</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-container">
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="text-input" 
            />
          </div>
          <div className="input-container">
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="text-input" 
            />
          </div>
          <button type="submit" className="submit-button">Log In</button>
          <div className="alternative-action">
            <span className="alternative-text">Don't have an account?</span>
            <Link to="/signup" className="alternative-link">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
