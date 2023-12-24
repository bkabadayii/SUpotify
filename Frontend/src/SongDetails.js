import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { postRating } from './postRating';
import getRatingInfo from './getRatingInfo';
import { useHistory } from 'react-router-dom';
import './SongDetails.css'
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa';
import Navbar from './Navbar';

const SongDetails = () => {
  const [songDetails, setSongDetails] = useState(null);
  const { trackID } = useParams(); // Assuming you are using react-router
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const [ratingInfo, setRatingInfo] = useState(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

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

  const handleCommentSubmit = () => {
    // Post New Comment
    axios.post('http://localhost:4000/api/comments/commentContent', {
      contentType: 'TRACK',
      relatedID: trackID,
      comment: newComment
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      if (response.data.success) {
        setComments([...comments, {
          username: username, 
          commentContent: newComment,
          // ... other comment details
        }]);
        setNewComment('');
        alert('Comment posted successfully');
        fetchComments();
      }
    })
    .catch(error => console.error('Error posting comment:', error));
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

  const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  const handleLikeComment = (commentIndex) => {
    // Logic to like/unlike a comment

    fetchComments(); 
  };

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylistId) {
      alert('Please select a playlist.');
      return;
    }
  
    try {
      await axios.post('http://localhost:4000/api/playlists/addTrackToPlaylist', {
        playlistID: selectedPlaylistId,
        trackID: trackID
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Song added to playlist!');
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      alert('Failed to add song to playlist.');
    }
  };  

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/comments/getContentComments/TRACK/${trackID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setComments(response.data.allComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    console.log(trackID);

    const fetchUserPlaylists = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/playlists/getUserPlaylists', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setUserPlaylists(response.data.userToPlaylists.playlists);
        }
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };
  
    fetchUserPlaylists();

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

    fetchComments();

  }, [trackID, token]);

  if (!songDetails) {
    return <div>Loading...</div>; // or any other loading state representation
  }

  return (
    <div>
      <Navbar/>
    <div className="song-details">
      {/* Overlay */}
      <div className={showPlaylistModal ? 'overlay active' : 'overlay'} onClick={() => setShowPlaylistModal(false)}></div>
      {showPlaylistModal && (
        <div className="playlist-modal">
          <h2>Select a Playlist</h2>
          <select 
            value={selectedPlaylistId} 
            onChange={(e) => setSelectedPlaylistId(e.target.value)}
          >
            <option value="">Select a playlist</option>
            {userPlaylists.map(playlist => (
              <option key={playlist._id} value={playlist._id}>{playlist.name}</option>
            ))}
          </select>
          <button onClick={handleAddToPlaylist}>Add to Playlist</button>
          <button onClick={() => setShowPlaylistModal(false)}>Cancel</button>
        </div>
      )}
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
      <button onClick={() => setShowPlaylistModal(true)}>Add to Playlist</button>
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
      <div className="song-detail-comments-section">
        <h2>Comments</h2>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>
              <p><strong>{comment.username}</strong>: {comment.commentContent}</p>
              <p>Commented on {formatCommentDate(comment.commentedAt)}</p>
              <button 
                className="song-detail-like-comment-button" 
                onClick={() => handleLikeComment(index)}
              >
                {comment.selfLike ? <FaThumbsUp /> : <FaRegThumbsUp />} 
                <span>{comment.totalLikes}</span>
              </button>
            </li>
          ))}
        </ul>
        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} />
        <button onClick={handleCommentSubmit}>Comment</button>
      </div>
    </div>
    </div>
  );
};

export default SongDetails;
