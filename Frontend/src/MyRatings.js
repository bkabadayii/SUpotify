import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { getTrackInfo } from './getTrackInfo';
import { getAlbumInfo } from './getAlbumInfo';
import { getArtistInfo } from './getArtistInfo';
import './MyRatings.css'; // Make sure to create and style this CSS file
import Navbar from './Navbar';

const MyRatings = () => {
  const [ratings, setRatings] = useState({
    trackRatings: [],
    albumRatings: [],
    artistRatings: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');
  const history = useHistory();

  const goToSongDetails = (songId) => {
    history.push(`/song/${songId}`);
  };

  const goToAlbumDetails = (albumId) => {
    history.push(`/album/${albumId}`);
  };

  const goToArtistDetails = (artistId) => {
    history.push(`/artist/${artistId}`);
  };

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/ratings/getUserToRatings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          
          const fetchedRatings = response.data.existingUserToRatings;
          
          const trackRatingsWithDetails = await Promise.all(
            fetchedRatings.trackRatings.map(async (rating) => {
              const trackDetails = await getTrackInfo(token, rating.track);
              return { ...rating, trackDetails };
            })
          );

          const albumRatingsWithDetails = await Promise.all(
            fetchedRatings.albumRatings.map(async (rating) => {
              const albumDetails = await getAlbumInfo(token, rating.album);
              return { ...rating, albumDetails };
            })
          );

          const artistRatingsWithDetails = await Promise.all(
            fetchedRatings.artistRatings.map(async (rating) => {
              const artistDetails = await getArtistInfo(token, rating.artist);
              return { ...rating, artistDetails };
            })
          );

          setRatings({
            ...fetchedRatings,
            trackRatings: trackRatingsWithDetails,
            albumRatings: albumRatingsWithDetails,
            artistRatings: artistRatingsWithDetails
          });

          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };


    fetchRatings();
  }, [token]);

  if (isLoading) {
    return <div className="my-ratings">
      <h2>Preparing your ratings...</h2>
    </div>;
  }

  return (
    <div>
      <Navbar/>
    <div className="my-ratings">
      <h2>My Track Ratings</h2>
      <div className="ratings-list">
        {ratings.trackRatings.map(rating => (
          <div key={rating._id} className="rating-item" onClick={() => goToSongDetails(rating.track)} >
            <img src={rating.trackDetails?.album.imageURL} alt={rating.trackDetails?.name} />
            <div> {/* Wrap the paragraphs in a div */}
              <p>{rating.trackDetails?.name}</p>
              <p>Artists: {rating.trackDetails?.artists.map(artist => artist.name).join(', ')}</p>
              <p>Album: {rating.trackDetails?.album.name}</p>
              <p>Rating: {rating.rating}/10</p>
              <p>Rated on: {new Date(rating.ratedAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
      <p></p>
      <h2>My Album Ratings</h2>
      <div className="ratings-list">
        {ratings.albumRatings.map(rating => (
          <div key={rating._id} className="rating-item" onClick={() => goToAlbumDetails(rating.album)}>
            <img src={rating.albumDetails?.imageURL} alt={rating.albumDetails?.name} />
            <div>
              <p>{rating.albumDetails?.name}</p>
              <p>Rating: {rating.rating}/10</p>
              <p>Rated on: {new Date(rating.ratedAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
      <p></p>
      <h2>My Artist Ratings</h2>
      <div className="ratings-list">
        {ratings.artistRatings.map(rating => (
          <div key={rating._id} className="rating-item" onClick={() => goToArtistDetails(rating.artist)}>
            <img src={rating.artistDetails?.imageURL} alt={rating.artistDetails?.name} />
            <div>
              <p>{rating.artistDetails?.name}</p>
              <p>Rating: {rating.rating}/10</p>
              <p>Rated on: {new Date(rating.ratedAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default MyRatings;

