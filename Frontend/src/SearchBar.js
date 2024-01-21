import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './SearchBar.css';
import Navbar from './Navbar';

const SearchBar = () => {
  const token = localStorage.getItem('token');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ Tracks: [], Albums: [], Artists: [] });
  const [isSearched, setIsSearched] = useState(false);
  const history = useHistory();


  const handleChange = (value) => {
    setSearchTerm(value);
    if (value.trim() !== '') {
      handleSearch();
    } else {
      setIsSearched(false); // Reset search state when input is cleared
    }
  }

  const handleSearch = async () => {
    setIsSearched(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:4000/api/getFromSpotify/search/${encodeURIComponent(searchTerm)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data.success) {
        // Check if the response has the expected structure
        console.log(response.data);
        const { Tracks, Albums, Artists } = response.data.data;
        setSearchResults({
          Tracks: Tracks || [],
          Albums: Albums || [],
          Artists: Artists || []
        });
      } else {

      }
    } catch (error) {

    }
  };

  const handleLikeTrack = async (songId, albumId, event) => {
    event.stopPropagation();
    try {
      const response = await axios.post('http://localhost:4000/api/likedContent/likeTrackBySpotifyID', {
        spotifyID: songId,
        albumSpotifyID: albumId
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
  
  const handleLikeAlbum = async (albumId) => {
    try {
      const response = await axios.post('http://localhost:4000/api/likedContent/likeAlbumBySpotifyID', {
        spotifyID: albumId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log(response)

      if(response.data.success) {
        alert("Album added to liked albums!");
      } else {
        alert("Could not add album to liked albums.");
      }
    } catch (error) {
      console.error('Error liking album:', error);
      alert('An error occurred while liking the album.');
    }
  };

  const handleLikeArtist = async (artistId) => {
    try {
      const response = await axios.post('http://localhost:4000/api/likedContent/likeArtistBySpotifyID', {
        spotifyID: artistId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log(response)

      if(response.data.success) {
        alert("Artist added to liked artists!");
      } else {
        alert("Could not add artist to liked artists.");
      }
    } catch (error) {
      console.error('Error liking artist:', error);
      alert('An error occurred while liking the artist.');
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="search-bar-container">
      <div className="search-input-container">
        <input
          className="search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter search term..."
        />
        {/*<button className="search-button" onClick={handleSearch}>Search</button>*/}

        <p></p>
        <div className="search-results">
          {isSearched && searchResults.Tracks.length > 0 && <h2>Tracks</h2>}
          {searchResults.Tracks.map((track) => (
            <div key={track.id} className="search-result-item">
            <img src={track.image} alt={track.name} className="search-result-image" />
            <div className="search-result-info">
            <p>{track.name} by {track.artists.join(', ')}</p>
            <button onClick={(event) => handleLikeTrack(track.id, track.albumID, event)} className="like-button">Like
            </button>
            </div>
            </div>  
          ))}


          {isSearched && searchResults.Albums.length > 0 && <h2>Albums</h2>}
          {searchResults.Albums.map((album) => (
            <div key={album.id} className="search-result-item">
            <img src={album.image} alt={album.name} className="search-result-image" />
            <div className="search-result-info">
            <p>{album.name} by {album.artists.join(', ')}</p>
            <button onClick={() => handleLikeAlbum(album.id)} className="like-button">Like
            </button>
            </div>
            </div>
          ))}

          {isSearched && searchResults.Artists.length > 0 && <h2>Artists</h2>}
          {searchResults.Artists.map((artist) => (
            <div key={artist.id} className="search-result-item">
            <img src={artist.image} alt={artist.name} className="search-result-image" />
            <div className="search-result-info">
            <p>{artist.name}</p>
            <button onClick={() => handleLikeArtist(artist.id)} className="like-button">Like
            </button>
            </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      </div>
  );
};

export default SearchBar;
