import React from 'react';
import Navbar from './Navbar';
import Home from './Home';
import Login from './Login';

const App = () => {

  return (
      <div className='App'>
        <Navbar />
        <div className='content'>
          <Login/>
        </div>
      </div>
  );
}

export default App;
