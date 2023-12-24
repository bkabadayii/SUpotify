import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './MyProfile.css'; // Ensure this CSS file is created and linked
import Navbar from './Navbar';

const MyProfile = () => {
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [followedUsername, setFollowedUsername] = useState('');
  const [followedUsers, setFollowedUsers] = useState([]);
  const [showFollowedUsersCard, setShowFollowedUsersCard] = useState(false);

  const [showFollowersCard, setShowFollowersCard] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState(new Set());

  const history = useHistory();

  const fetchFollowers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/followedUsers/getBlockedUsers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response)
      setFollowers(response.data.allFollowers); // Assuming the response structure
      setBlockedUsers(new Set(response.data.blockedUsers));
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const handleBlockUser = async (username) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/api/followedUsers/recommendationBlockUser', 
        { blockedUsername: username }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFollowers(); // Refetch followers to update the list
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleUnblockUser = async (username) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:4000/api/followedUsers/recommendationUnblockUser', {
        data: { blockedUsername: username },
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFollowers(); // Refetch followers to update the list
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const handleShowFollowers = () => {
    setShowFollowersCard(!showFollowersCard);
    if (!showFollowersCard) {
      fetchFollowers(); // Fetch followers when opening the card
    }
  };


  const fetchFollowedUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/followedUsers/getAllFollowedUsersForUser', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response)
      setFollowedUsers(response.data.followedUsers); // Assuming the response structure
    } catch (error) {
      console.error('Error fetching followed users:', error);
    }
  };
  
  const removeFollowedUser = async (username) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:4000/api/followedUsers/removeFromUserFollowedUsers', {
        data: { followedUsername: username },
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update the list of followed users after successful removal
      fetchFollowedUsers();
    } catch (error) {
      console.error('Error removing followed user:', error);
      alert('Error removing followed user');
    }
  };  

  const handleShowFollowedUsers = () => {
    setShowFollowedUsersCard(!showFollowedUsersCard);
    if (!showFollowedUsersCard) {
      fetchFollowedUsers(); // Fetch followed users when opening the card
    }
  };

  const navigateToPlaylist = (playlistID) => {
    history.push(`/playlist/${playlistID}`); // Update the route as per your route configuration
  };

  const handleFollowUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:4000/api/followedUsers/addToUserFollowedUsers',
        { followedUsername: followedUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Successfully followed ${followedUsername}`);
      setFollowedUsername(''); // Reset the input field after following
    } catch (error) {
      console.error('Error following user:', error);
      alert('Error following user');
    }
  };

// Function to fetch user's playlists
  const fetchPlaylists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/playlists/getUserPlaylists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response);

      if (response.data) {
        setMyPlaylists(response.data.userToPlaylists.playlists);
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  // Fetch playlists on component mount
  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = () => {
    setIsCreatingPlaylist(true);
  };

  const handlePlaylistNameChange = (e) => {
    setNewPlaylistName(e.target.value);
  };

  const handleSubmitPlaylist = async () => {
    if (!newPlaylistName) {
      alert("Please enter a playlist name.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/playlists/createPlaylist', 
        { playlistName: newPlaylistName }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("Playlist created successfully!");
        fetchPlaylists();
        // Handle success (e.g., close modal and clear input)
      } else {
        alert("Failed to create playlist.");
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert('An error occurred while creating the playlist.');
    } finally {
      setIsCreatingPlaylist(false);
      setNewPlaylistName('');
    }
  };

  const handleDeletePlaylist = async (playlistID, event) => {
    event.stopPropagation()
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:4000/api/playlists/deletePlaylist', {
        data: { playlistID: playlistID },
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refetch playlists after deletion
      fetchPlaylists();
    } catch (error) {
      console.error('Error deleting playlist:', error);
      alert('An error occurred while deleting the playlist.');
    }
  };

  // Sample data for profile - replace with real data
  const profileData = {
    username: localStorage.getItem('username'),
    followers: 120, // Replace with actual data
    following: 75,  // Replace with actual data
    profilePhoto: "https://via.placeholder.com/150" // Replace with actual image source
  };

  return (
      <div>
        <Navbar/>
      <div className="main-container">
      <div className="profile-container">
        <div className="profile-photo">
          <img src={profileData.profilePhoto} alt="Profile" />
        </div>
        <div className="profile-info">
          <h2>{profileData.username}</h2>
          <button onClick={handleShowFollowedUsers}>Following</button>
            {showFollowedUsersCard && (
              <div className="followed-users-card">
                <h3>Followed Users</h3>
                <ul>
                {followedUsers.map((user, index) => (
                  <li key={index}>
                    {user}
                    <button onClick={() => removeFollowedUser(user)} className="remove-button">
                      Unfollow
                    </button>
                  </li>
                ))}
                </ul>
              </div>
            )}
          <button onClick={handleShowFollowers}>Followers</button>
          {showFollowersCard && (
            <div className="followers-card">
              <h3>Followers</h3>
              <ul>
                {followers.map((follower, index) => (
                  <li key={index}>
                    {follower}
                    {blockedUsers.has(follower) ? 
                      <button onClick={() => handleUnblockUser(follower)}>Unblock</button> : 
                      <button onClick={() => handleBlockUser(follower)}>Block</button>
                    }
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="follow-user-container">
        <input
          type="text"
          value={followedUsername}
          onChange={(e) => setFollowedUsername(e.target.value)}
          placeholder="Enter username to follow"
        />
        <button onClick={handleFollowUser}>Follow User</button>
      </div>
      </div>
      <div className="playlists-container">
        <h2>My Playlists</h2>
        <button onClick={handleCreatePlaylist}>Create Playlist</button>
          {isCreatingPlaylist && (
            <div>
              <input 
                type="text" 
                value={newPlaylistName} 
                onChange={handlePlaylistNameChange} 
                placeholder="Enter playlist name" 
              />
              <button onClick={handleSubmitPlaylist}>Submit</button>
            </div>
          )}
        {myPlaylists.map((playlist) => (
          <div key={playlist._id} className="playlist-item">
            <p onClick={() => navigateToPlaylist(playlist._id)} className="playlist-name">
              {playlist.name}
            </p>
            <button onClick={(event) => handleDeletePlaylist(playlist._id, event)} className="delete-button">
              Delete Playlist
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default MyProfile;