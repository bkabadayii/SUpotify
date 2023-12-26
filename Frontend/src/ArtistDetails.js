import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { postRating } from './postRating';
import getRatingInfo from './getRatingInfo';
import { useHistory } from 'react-router-dom';
import './ArtistDetails.css';
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa';
import Navbar from './Navbar';

const ArtistDetails = () => {
    const [artistDetails, setArtistDetails] = useState(null);
    const { artistID } = useParams();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const [ratingInfo, setRatingInfo] = useState(null);
    const history = useHistory();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const handleRating = (rating) => {
      const token = localStorage.getItem('token');
      postRating(token, "ARTIST", artistID, rating);
    };

    const goToAlbumDetails = (albumId) => {
        history.push(`/album/${albumId}`);
      };

    const handleCommentSubmit = () => {
        // Post New Comment
        axios.post('http://localhost:4000/api/comments/commentContent', {
          contentType: 'ARTIST',
          relatedID: artistID,
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
              contentType: "ARTIST",
              relatedID: artistID
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
          const response = await axios.get(`http://localhost:4000/api/comments/getContentComments/ARTIST/${artistID}`, {
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
        const fetchArtistDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/content/getArtist/${artistID}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(response)
                if (response.data.success) {
                    setArtistDetails(response.data.artist);
                }
            } catch (error) {
                console.error('Error fetching artist details:', error);
            }
        };

        fetchArtistDetails();

        const fetchRating = async () => {
            const ratingInfo = await getRatingInfo(token, 'ARTIST', artistID);
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

    }, [artistID, token]);

    if (!artistDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div>
        <Navbar/>
        <div className="artist-details">
            <div className="artist-header">
                <img src={artistDetails.imageURL} alt={artistDetails.name} className="artist-image" />
                <div className="artist-info">
                    <h1>{artistDetails.name}</h1>
                    <p>Genres: {artistDetails.genres.join(', ')}</p>
                    <p>Popularity: {artistDetails.popularity}</p>
                    <a href={artistDetails.spotifyURL} target="_blank" rel="noopener noreferrer" className="spotify-link">Listen on Spotify</a>
                </div>
            </div>
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
            <div className="artist-albums">
                <h2>Albums</h2>
                <ul>
                {artistDetails.albums.map(album => (
                    <li key={album} onClick={() => goToAlbumDetails(album._id)}>
                    <img src={album.imageURL} alt={album.name} />
                    <div>
                        <p>{album.name}</p>
                    </div>
                    </li>
                ))}
                </ul>
            </div>
            <div className="artist-detail-comments-section">
                <h2>Comments</h2>
                <ul>
                {comments.map((comment, index) => (
                    <li key={index}>
                    <p><strong>{comment.username}</strong>: {comment.commentContent}</p>
                    <p>Commented on {formatCommentDate(comment.commentedAt)}</p>
                    <button 
                        className="artist-detail-like-comment-button" 
                        onClick={() => handleLikeComment(comment._id)}
                    >
                        {comment.selfLike ? <FaThumbsUp /> : <FaRegThumbsUp />} 
                        <span>{comment.totalLikes}</span>
                    </button>
                    {/* Only show delete button for user's own comments */}
                    {comment.username === username && (
                      <button 
                        className="artist-delete-comment-button" 
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

export default ArtistDetails;
