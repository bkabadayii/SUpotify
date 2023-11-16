import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Login from './Login';
import Home from './Home';
import Signup from './Signup';
import ProtectedRoute from './ProtectedRoute';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LikedSongs from './LikedSongs';
import MyProfile from './MyProfile';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    // Check if the user is authenticated (e.g., check for the presence of a token)
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [isAuthenticated]); // Trigger the effect whenever isAuthenticated changes

  return (
    <Router>
      <div className='App'>
        <Navbar />
        <div className='content'>
          <Switch>
            <ProtectedRoute
              exact
              path='/'
              component={Home}
              isAuthenticated={isAuthenticated}
            />
            <Route path='/signup'>
              <Signup />
            </Route>
            <Route path='/login'>
              <Login setIsAuthenticated={setIsAuthenticated} />
            </Route>
            <Route path='/likedsongs'>
              <LikedSongs />
            </Route>
            <Route path='/myprofile'>
              <MyProfile />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
