// Home.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import Font Awesome
import { faSearch, faHeart, faUser, faStar, faLightbulb, faChartBar } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import Navbar from './Navbar';


const Home = () => {
  const history = useHistory();

  const goToSearch = () => {
    history.push('/search');
  };

  const goToLikedContent = () => {
    history.push('/likedcontent');
  };

  const goToMyProfile = () => {
    history.push('/myprofile');
  };

  const goToMyRatings = () => {
    history.push('/myratings');
  };

  const goToRecommendations = () => {
    history.push('/recommendation');
  };

  const goToStats = () => {
    history.push('/stats');
  };

  return (
    <div>
      <Navbar/>
    <div className="home-container">
      <div className="home-card" onClick={goToSearch}>
        <FontAwesomeIcon icon={faSearch} className="home-card-icon" />
        <h2 className="home-card-title">Search</h2>
      </div>
  
      <div className="home-card" onClick={goToLikedContent}>
        <FontAwesomeIcon icon={faHeart} className="home-card-icon" />
        <h2 className="home-card-title">Liked Content</h2>
      </div>

      <div className="home-card" onClick={goToMyProfile}>
        <FontAwesomeIcon icon={faUser} className="home-card-icon" />
        <h2 className="home-card-title">My Profile</h2>  
      </div>

      <div className="home-card" onClick={goToMyRatings}>
        <FontAwesomeIcon icon={faStar} className="home-card-icon" />
        <h2 className="home-card-title">My Ratings</h2>
      </div>

      <div className="home-card" onClick={goToRecommendations}>
        <FontAwesomeIcon icon={faLightbulb} className="home-card-icon" />
        <h2 className="home-card-title">Recommendation</h2>
        
      </div>

      <div className="home-card" onClick={goToStats}>
        <FontAwesomeIcon icon={faChartBar} className="home-card-icon" />
        <h2 className="home-card-title">SUpotify Stats</h2>
        
      </div>

    </div>
    </div>
  );
};

export default Home;
