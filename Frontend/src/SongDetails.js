import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { postRating } from './postRating';
import getRatingInfo from './getRatingInfo';
import { useHistory } from 'react-router-dom';
import './SongDetails.css'
import Navbar from './Navbar';

const SongDetails = () => {
  const [songDetails, setSongDetails] = useState(null);
  const { trackID } = useParams(); // Assuming you are using react-router
  const token = localStorage.getItem('token');
  const [ratingInfo, setRatingInfo] = useState(null);
  const history = useHistory();

  const goToAlbumPage = () => {
    history.push(`/album/${songDetails.album._id}`);
  };

  const goToArtistDetails = (artistID) => {
    history.push(`/artist/${artistID}`);
  };

  const handleRating = (rating) => {
    const token = localStorage.getItem('token');
    postRating(token, "TRACK", trackID, rating);
  };

  const handleLikeSong = async () => {
    try {
        const response = await axios.post('http://localhost:4000/api/likedContent/likeContent', {
            contentID: trackID,
            contentType: "TRACK"
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
            alert("Song added to liked songs!");
        }
    } catch (error) {
        console.error('Error adding song to liked songs:', error);
        alert('An error occurred while adding the song to liked songs.');
    }
  };

  useEffect(() => {
    console.log(trackID);
    
    const fetchSongDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/content/getTrack/${trackID}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setSongDetails(response.data.track);
          console.log(response);
        }
      } catch (error) {
        console.error('Error fetching song details:', error);
        // Handle error
      }
    };

    fetchSongDetails();

    const fetchRating = async () => {
      const ratingInfo = await getRatingInfo(token, 'TRACK', trackID);
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

  }, [trackID, token]);

  if (!songDetails) {
    return <div>Loading...</div>; // or any other loading state representation
  }

  return (
    <div>
      <Navbar/>
    <div className="song-details">
      <h1>{songDetails.name}</h1>
      <div className="artists">
        {songDetails.artists.map((artist) => (
          <a key={artist._id} className="artist-link" onClick={() => goToArtistDetails(artist._id)}>
            <img src={artist.imageURL} alt={artist.name} />
            <span>{artist.name}</span>
          </a>
        ))}
      </div>
      <div className="album-info">
        <img src={songDetails.album.imageURL} alt={songDetails.album.name} />
        <div>
          <p>Album: <span className="album-link" onClick={goToAlbumPage}>{songDetails.album.name}</span></p>
          <p>Popularity: {songDetails.popularity}</p>
          <p>Duration: {songDetails.durationMS} ms</p>
        </div>
      </div>
      <button className="songdetail-like-button" onClick={handleLikeSong}>Add to Liked Songs</button>
      <p></p>
      <a>Rate Song:</a>
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
      <div className="song-preview">
        {songDetails.previewURL && <audio controls src={songDetails.previewURL}>Your browser does not support the audio element.</audio>}
      </div>
      {/* Include a back button or navigation as needed */}
    </div>
    </div>
  );
};

export default SongDetails;
