// Home.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import './Home.css'; // Ensure you have this CSS file in the same directory as your Home.js
import SearchBar from './SearchBar';

const Home = () => {
  const history = useHistory();

  const goToLikedSongs = () => {
    history.push('/likedsongs');
  };

  const goToMyProfile = () => {
    history.push('/myprofile');
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
      <div>
        <SearchBar />
      </div>
      <div className="card" style={cardStyle} onClick={goToLikedSongs}>
        <div style={cardContentStyle}>
          <h2>Liked Songs</h2>
        </div>
      </div>

      <div className="card" style={cardStyle} onClick={goToMyProfile}>
        <div style={cardContentStyle}>
          <h2>My Profile</h2>
        </div>
      </div>
    </div>
  );
};

export default Home;
