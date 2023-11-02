import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const App = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div>
      
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </li>
      </ul>

      {activeTab === 'login' ? <Login /> : <Signup />}
    </div>
  );
}

export default App;
