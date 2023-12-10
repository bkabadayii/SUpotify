// Home.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import './Home.css';

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

  // Inline styles
  const cardStyle = {
    width: '300px',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: 'rgb(37, 27, 106)', // Purple background
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100px',
    marginBottom: '20px',
  };

  const cardContentStyle = {
    textAlign: 'center',
    width: '100%', // Ensure the content takes up the full width of the card
    padding: '10px',
    color: 'white', // Set text color to white
  };

  return (
    <div className="home-container">
      <div className="card" style={cardStyle} onClick={goToSearch}>
        <div style={cardContentStyle}>
          <h2>Search</h2>
        </div>
      </div>
  
      <div className="card" style={cardStyle} onClick={goToLikedContent}>
        <div style={cardContentStyle}>
          <h2>Liked Content</h2>
        </div>
      </div>

      <div className="card" style={cardStyle} onClick={goToMyProfile}>
        <div style={cardContentStyle}>
          <h2>My Profile</h2>
        </div>
      </div>

      <div className="card" style={cardStyle} onClick={goToMyRatings}>
        <div style={cardContentStyle}>
          <h2>My Ratings</h2>
        </div>
      </div>

      <div className="card" style={cardStyle} onClick={goToRecommendations}>
        <div style={cardContentStyle}>
          <h2>Recommendation</h2>
        </div>
      </div>

      <div className="card" style={cardStyle} onClick={goToStats}>
        <div style={cardContentStyle}>
          <h2>SUpotify Stats</h2>
        </div>
      </div>

    </div>
  );
};

export default Home;
