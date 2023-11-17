import React, { useState } from 'react';
import axios from 'axios';
import './SearchBar.css';

const SearchBar = () => {
  const token = localStorage.getItem('token');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ Tracks: [], Albums: [], Artists: [] });

  const handleSearch = async () => {
    
    try {
      const response = await axios.get(`http://localhost:4000/api/getFromSpotify/search/${encodeURIComponent(searchTerm)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data.success) {
        // Check if the response has the expected structure
        console.log("Search successful!"); // Debug log
        console.log(response.data);
        const { Tracks, Albums, Artists } = response.data.data;
        setSearchResults({
          Tracks: Tracks || [],
          Albums: Albums || [],
          Artists: Artists || []
        });
      } else {
        console.log('Search was not successful:', response.data.message);
        alert('Search not successful!');
      }
    } catch (error) {
      console.error('Error during search request:', error);
      alert('Search not successful!');
    }
  };

  const handleLike = async (songId, albumId) => {
    try {
      const response = await axios.post('http://localhost:4000/api/likedSongs/addToUserLikedSongsBySpotifyID', {
        spotifyID: songId,
        albumID: albumId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log(response)
      console.log(songId)

      if(response.data.success) {
        alert("Song added to liked songs!");
      } else {
        alert("Could not add song to liked songs.");
      }
    } catch (error) {
      console.error('Error liking song:', error);
      alert('An error occurred while liking the song.');
    }
  };
  

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter search term..."
      />
      <button onClick={handleSearch}>Search</button>

      <p></p>
      <div>
        <h2>Tracks</h2>
        {searchResults.Tracks.map((track) => (
          <div key={track.id} className="search-result-item">
          <img src={track.image} alt={track.name} className="search-result-image" />
          <div className="search-result-info">
          <p>{track.name} by {track.artists.join(', ')}</p>
          <button onClick={() => handleLike(track.id, track.albumID)} className="like-button">👍 Like
      </button>
          </div>
          </div>  
        ))}


        <h2>Albums</h2>
        {searchResults.Albums.map((album) => (
          <div key={album.id} className="search-result-item">
          <img src={album.image} alt={album.name} className="search-result-image" />
          <div className="search-result-info">
          <p>{album.name} by {album.artists.join(', ')}</p>
          </div>
          </div>
        ))}

        <h2>Artists</h2>
        {searchResults.Artists.map((artist) => (
          <div key={artist.id} className="search-result-item">
          <img src={artist.image} alt={artist.name} className="search-result-image" />
          <div className="search-result-info">
          <p>{artist.name}</p>
          </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
