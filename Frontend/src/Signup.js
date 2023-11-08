import React, {useState} from 'react';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup =  async (e) => {
    e.preventDefault()
    const res = await axios.post("http://localhost:4000/auth/signup", {email, username, password}, {withCredentials: true})
    console.log(res)

    if(res.data.success === true)
    {
      console.log("WELCOME")
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 signup-container">
      <div className="bg-white p-5 rounded w-15">
        <h2>Sign Up</h2>
        <p></p>
        <form>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail2" className="form-label">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail2" aria-describedby="emailHelp" onChange= {(e) => {
            e.preventDefault()
            setEmail(e.target.value)
            console.log(email)
          }}/>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail2" className="form-label">Username</label>
            <input type="username" className="form-control" id="exampleInputEmail2" aria-describedby="emailHelp" onChange= {(e) => {
            e.preventDefault()
            setUsername(e.target.value)
            console.log(username)
          }}/>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword2" className="form-label">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword2" onChange={ (e) => {
            e.preventDefault()
            setPassword(e.target.value)
            console.log(password)
          }}/>
          </div>
          <button className='btn btn-default border w-100 bg-light' onClick={handleSignup}>Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
