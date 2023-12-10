import React, {useState} from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup =  async (e) => {
    e.preventDefault()
    
    if(email !== '' && password !== '' && password !== '')
    {
      const res = await axios.post("http://localhost:4000/auth/signup", {email, username, password}, {withCredentials: true})
      console.log(res)

      if(res.data.success === true)
      {
        alert('Sign up successful. You can now log in to your account.')
      }
      else
      {
        alert('User already exists.')
      }
    }
    else
    {
      alert('Please fill all fields.')
    }
    
  }

  return (
    <div className="signup-background">
      <div className="signup-container">
        <h1 className="signup-header">Sign Up to SUpotify</h1>
        <form onSubmit={handleSignup} className="signup-form">
          <div className="signup-input-container">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="signup-text-input"
            />
          </div>
          <div className="signup-input-container">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="signup-text-input"
            />
          </div>
          <div className="signup-input-container">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="signup-text-input"
            />
          </div>
          <button type="submit" className="signup-submit-btn">Sign Up</button>
          <div className="alternative-action">
            <span className="alternative-text">Already have an account?</span>
            <Link to="/login" className="alternative-link">Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
