import React from 'react';

const Login = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className='bg-white p-5 rounded w-25'>
      <h2>Login</h2> {/* Add a title above the form */}
      <p> </p>
      <form>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Email address</label>
          <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" class="form-control" id="exampleInputPassword1"/>
        </div>
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
          <label class="form-check-label" for="exampleCheck1">Remember Me</label>
        </div>
        <button className= 'btn btn-success w-100'> Log in</button>
        <p></p>
        <p>Don't have an account?</p>
        <button className='btn btn-default border w-100 bg-light'>Create Account</button>
      </form>
      </div>
    </div>
  );
}

export default Login;
