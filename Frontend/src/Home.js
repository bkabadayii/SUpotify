// Home.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import Font Awesome
import { faSearch, faHeart, faUser, faStar, faLightbulb, faChartBar } from '@fortawesome/free-solid-svg-icons'; // Import specific icons


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
    <div className="home-container">
      <div className="card" onClick={goToSearch}>
        <FontAwesomeIcon icon={faSearch} className="card-icon" />
        <h2 className="card-title">Search</h2>
      </div>
  
      <div className="card" onClick={goToLikedContent}>
        <FontAwesomeIcon icon={faHeart} className="card-icon" />
        <h2 className="card-title">Liked Content</h2>
      </div>

      <div className="card" onClick={goToMyProfile}>
        <FontAwesomeIcon icon={faUser} className="card-icon" />
        <h2 className="card-title">My Profile</h2>  
      </div>

      <div className="card" onClick={goToMyRatings}>
        <FontAwesomeIcon icon={faStar} className="card-icon" />
        <h2 className="card-title">My Ratings</h2>
      </div>

      <div className="card" onClick={goToRecommendations}>
        <FontAwesomeIcon icon={faLightbulb} className="card-icon" />
        <h2 className="card-title">Recommendation</h2>
        
      </div>

      <div className="card" onClick={goToStats}>
        <FontAwesomeIcon icon={faChartBar} className="card-icon" />
        <h2 className="card-title">SUpotify Stats</h2>
        
      </div>

    </div>
  );
};

export default Home;
