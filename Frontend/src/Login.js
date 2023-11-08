import React, { useState }  from 'react';
import axios from 'axios';
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  
  const handleLogin =  async (e) => {
    e.preventDefault()
    const res = await axios.post("http://localhost:4000/auth/login", {email, password}, {withCredentials: true})
    console.log(res)

    if(res.data.success === true)
    {
      console.log("WELCOME")
      // Navigate to Home Screen
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 login-container">
      <div className='bg-white p-5 rounded w-15'>
      <h2>Login</h2>
      <p> </p>
      <form>
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange= {(e) => {
            e.preventDefault()
            setEmail(e.target.value)
            console.log(email)
          }}/>
        </div>
        <div className="mb-3">
          <label for="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" onChange={ (e) => {
            e.preventDefault()
            setPassword(e.target.value)
            console.log(password)
          }}/>
        </div>
        <button className='btn btn-default border w-100 bg-light' onClick={handleLogin}> Log in</button>
        <p></p>
        <p>Don't have an account?</p>
        <button className='btn btn-default border w-100 bg-light'>Create Account</button>
      </form>
      </div>
    </div>
  );
}

export default Login;
