import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { postRating } from './postRating';
import getRatingInfo from './getRatingInfo';
import { useHistory } from 'react-router-dom';
import './AlbumDetails.css';
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa';
import Navbar from './Navbar';

const AlbumDetails = () => {
  const [albumDetails, setAlbumDetails] = useState(null);
  const { albumID } = useParams();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const [ratingInfo, setRatingInfo] = useState(null);
  const history = useHistory();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const goToSongDetails = (songId) => {
    history.push(`/song/${songId}`);
  };

  const goToArtistDetails = (artistId) => {
    history.push(`/artist/${artistId}`);
  };

  const handleCommentSubmit = () => {
    // Post New Comment
    axios.post('http://localhost:4000/api/comments/commentContent', {
      contentType: 'ALBUM',
      relatedID: albumID,
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

  const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  const handleLikeComment = async (commentID) => {
    try {
      await axios.post(
        'http://localhost:4000/api/comments/switchCommentLikeStatus',
        { commentID },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refetch comments to update UI
      fetchComments();
    } catch (error) {
      console.error('Error switching like status of comment:', error);
    }
  };

  const handleDeleteComment = async (commentID) => {
    try {
      await axios.delete(
        'http://localhost:4000/api/comments/deleteComment',
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { // Axios delete requests require data to be in the config object
            commentID,
            contentType: "ALBUM",
            relatedID: albumID
          }
        }
      );
      // Refetch comments to update UI
      fetchComments();
      alert('Comment deleted successfully.');
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment.');
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/comments/getContentComments/ALBUM/${albumID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setComments(response.data.allComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
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

    fetchComments();

  }, [albumID, token]);

  if (!albumDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar/>
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
      <div className="album-detail-comments-section">
        <h2>Comments</h2>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>
              <p><strong>{comment.username}</strong>: {comment.commentContent}</p>
              <p>Commented on {formatCommentDate(comment.commentedAt)}</p>
              <button 
                className="album-detail-like-comment-button" 
                onClick={() => handleLikeComment(comment._id)}
              >
                {comment.selfLike ? <FaThumbsUp /> : <FaRegThumbsUp />} 
                <span>{comment.totalLikes}</span>
              </button>
              {/* Only show delete button for user's own comments */}
              {comment.username === username && (
                <button 
                  className="album-delete-comment-button" 
                  onClick={() => handleDeleteComment(comment._id)}
                >
                  Delete
                </button>
              )}
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

export default AlbumDetails;
