import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { postRating } from './postRating';
import getRatingInfo from './getRatingInfo';
import { useHistory } from 'react-router-dom';
import './AlbumDetails.css';

const AlbumDetails = () => {
  const [albumDetails, setAlbumDetails] = useState(null);
  const { albumID } = useParams();
  const token = localStorage.getItem('token');
  const [ratingInfo, setRatingInfo] = useState(null);
  const history = useHistory();

  const goToSongDetails = (songId) => {
    history.push(`/song/${songId}`);
  };

  const goToArtistDetails = (artistId) => {
    history.push(`/artist/${artistId}`);
  };

  const handleLikeAlbum = async () => {
    try {
        const response = await axios.post('http://localhost:4000/api/likedContent/likeContent', {
            contentID: albumID,
            contentType: "ALBUM"
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
            alert("Album added to liked albums!");
        }
    } catch (error) {
        console.error('Error adding album to liked albums:', error);
        alert('An error occurred while adding the album to liked albums.');
    }
  };

  const handleRating = (rating) => {
    const token = localStorage.getItem('token');
    postRating(token, "ALBUM", albumID, rating);
  };

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/content/getAlbum/${albumID}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setAlbumDetails(response.data.album);
          console.log(response);
        }
      } catch (error) {
        console.error('Error fetching album details:', error);
      }
    };

    fetchAlbumDetails();

    const fetchRating = async () => {
      const ratingInfo = await getRatingInfo(token, 'ALBUM', albumID);
      if (ratingInfo && ratingInfo.success) {
          console.log("Rating Info:", ratingInfo);
          setRatingInfo(ratingInfo);
          // Process and display the rating information
      }
    };

    fetchRating();

    if (ratingInfo && ratingInfo.success) {
      setRatingInfo({
          selfRating: ratingInfo.selfRating,
          averageRating: ratingInfo.averageRating,
          numUsersRated: ratingInfo.numUsersRated
      });
    }

  }, [albumID, token]);

  if (!albumDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="album-details">
      <div className="album-header">
        <img src={albumDetails.imageURL} alt={albumDetails.name} className="album-art-large" />
        <div className="album-info">
          <h1>{albumDetails.name}</h1>
          <div className='album-info-date'>
            <p>Released on: {new Date(albumDetails.releaseDate).toLocaleDateString()}</p>
            <p>Total Tracks: {albumDetails.totalTracks}</p>
          </div>
        </div>
      </div>
      <div className="album-artists">
        {albumDetails.artists.map((artist) => (
          <a key={artist._id} className="artist-link" onClick={() => goToArtistDetails(artist._id)}>
            <img src={artist.imageURL} alt={artist.name} className="artist-image" />
            <span >{artist.name}</span>
          </a>
        ))}
      </div>
      <p></p>
      <button className="albumdetail-like-button" onClick={handleLikeAlbum}>Add to Liked Albums</button>
      <p></p>
      <a>Rate Album:</a>
      <div className="rating-container">
          {[...Array(10)].map((_, index) => (
              <button key={index} onClick={() => handleRating(index + 1)}>{index + 1}</button>
          ))}
      </div>
      <p></p>
      <div className="rating-info">
            {ratingInfo && (
                <>
                    <p>Your Rating: {ratingInfo.selfRating}</p>
                    <p>Average Rating: {ratingInfo.averageRating}</p>
                    <p>Number of Ratings: {ratingInfo.numUsersRated}</p>
                </>
            )}
      </div>
      <div className="track-list">
        <h2>Tracks</h2>
        <ul>
          {albumDetails.tracks.map((track) => (
            <li key={track._id} className="track-item" onClick={() => goToSongDetails(track._id)}>
              <img src={albumDetails.imageURL} alt="Album Art" className="album-art-small" />
              <span className="track-name">{track.name}</span>
              <span className="track-duration">{(track.durationMS / 60000).toFixed(2)} min</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AlbumDetails;
