import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Login from './Login';
import Home from './Home';
import Signup from './Signup';
import ProtectedRoute from './ProtectedRoute';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LikedContent from './LikedContent';
import MyProfile from './MyProfile';
import SearchBar from './SearchBar';
import SongDetails from './SongDetails';
import PlaylistPage from './PlaylistPage';
import AlbumDetails from './AlbumDetails';
import ArtistDetails from './ArtistDetails';
import MyRatings from './MyRatings';
import Recommendation from './Recommendation';
import Stats from './Stats';

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
            <Route path='/likedcontent'>
              <LikedContent />
            </Route>
            <Route path='/myprofile'>
              <MyProfile />
            </Route>
            <Route exact path='/search'>
              <SearchBar />
            </Route>
            <Route path='/album/:albumID'>
              <AlbumDetails />
            </Route>
            <Route path='/song/:trackID'>
              <SongDetails />
            </Route>
            <Route path='/artist/:artistID'>
              <ArtistDetails />
            </Route>
            <Route path='/playlist/:playlistId'>
            <PlaylistPage/>
            </Route>
            <Route exact path = '/myratings'>
            <MyRatings/>
            </Route>
            <Route path = '/recommendation'>
            <Recommendation/>
            </Route>
            <Route path = '/stats'>
            <Stats/>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
