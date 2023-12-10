import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { postRating } from './postRating';
import getRatingInfo from './getRatingInfo';
import { useHistory } from 'react-router-dom';
import './ArtistDetails.css';

const ArtistDetails = () => {
    const [artistDetails, setArtistDetails] = useState(null);
    const { artistID } = useParams();
    const token = localStorage.getItem('token');
    const [ratingInfo, setRatingInfo] = useState(null);
    const history = useHistory();

    const handleRating = (rating) => {
      const token = localStorage.getItem('token');
      postRating(token, "ARTIST", artistID, rating);
    };

    const goToAlbumDetails = (albumId) => {
        history.push(`/album/${albumId}`);
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

    }, [artistID, token]);

    if (!artistDetails) {
        return <div>Loading...</div>;
    }

    return (
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
        </div>
    );
};

export default ArtistDetails;
