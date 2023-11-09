import React from 'react';
import Navbar from './Navbar';
import Login from './Login';
import Home from './Home';
import Signup from './Signup'

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

const App = () => {

  return (
    <Router>
      <div className='App'>
        <Navbar />
        <div className='content'>
          <Switch>
            <Route exact path = '/' >
              <Home />
            </Route>
            <Route path = '/signup' >
              <Signup />
            </Route>
            <Route path = '/login' >
              <Login />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
