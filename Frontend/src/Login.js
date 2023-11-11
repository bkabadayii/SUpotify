import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

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
    <div className="justify-content-center align-items-center vh-100">
      <div className='p-5 rounded w-10'>
      <h2>Login</h2>
      <p> </p>
      <form>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail2" className="form-label">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange= {(e) => {
            e.preventDefault()
            setEmail(e.target.value)
          }} required />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword2" className="form-label">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" onChange={ (e) => {
            e.preventDefault()
            setPassword(e.target.value)
          }} required />
        </div>
        <button className='btn btn-default border w-50 bg-light' onClick={handleLogin}> Log in</button>
        <p></p>
        <p>Don't have an account?</p>
        <Link to="/signup">
          <button className='btn btn-default border w-50 bg-light'>Create Account</button>
        </Link>
      </form>
      </div>
    </div>
  );
}

export default Login;
