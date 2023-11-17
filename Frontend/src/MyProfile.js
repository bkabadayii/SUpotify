import React from 'react';
import './MyProfile.css'; // Ensure this CSS file is created and linked

const MyProfile = () => {
  // Sample data for profile - replace with real data
  const profileData = {
    username: localStorage.getItem('username'),
    followers: 120,
    following: 75,
    profilePhoto: "https://via.placeholder.com/150" // Replace with actual image source
  };

  // Sample data for playlists - replace with real data
  const myPlaylists = [
    { name: "Liked Songs"},
    { name: "Playlist 1"},
    { name: "Playlist 2"}
    // ... more playlists
  ];

  return (
    <div className="main-container">
      <div className="profile-container">
        <div className="profile-photo">
          <img src={profileData.profilePhoto} alt="Profile" />
        </div>
        <div className="profile-info">
          <h2>{profileData.username}</h2>
          <p>Followers: {profileData.followers}</p>
          <p>Following: {profileData.following}</p>
        </div>
      </div>
      <div className="playlists-container">
        <h2>My Playlists</h2>
        {myPlaylists.map((playlist, index) => (
          <div key={index} className="playlist-item">
            <p>{playlist.name} - {playlist.songCount} songs</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyProfile;
