import React from 'react';

const Signup = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-white p-5 rounded w-25">
        <h2>Sign Up</h2>
        <p></p>
        <form>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail2" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail2"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword2" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword2"
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck2"
            />
            <label className="form-check-label" htmlFor="exampleCheck2">
              Remember Me
            </label>
          </div>
          <button className='btn btn-default border w-100 bg-light'>Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
