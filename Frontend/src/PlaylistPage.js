import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import './PlaylistPage.css';
import Navbar from './Navbar';
import { toast } from 'react-toastify';


const PlaylistPage = () => {
  const [playlist, setPlaylist] = useState(null);
  const { playlistID } = useParams();
  const history = useHistory();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        console.log(playlistID);
        const response = await axios.get(`http://localhost:4000/api/playlists/getPlaylist/${playlistID}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response);
        if (response.data.success) {
          setPlaylist(response.data.playlist);
        }
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchPlaylist();
  }, [playlistID, token]);

  const goToSongDetails = (songId) => {
    history.push(`/song/${songId}`);
  };

  const navigateToRecommendations = () => {
    history.push('/recommendation');
  };

  const removeTrackFromPlaylist = async (trackID) => {
    try {
      await axios.delete('http://localhost:4000/api/playlists/removeTrackFromPlaylist', {
        data: {
          playlistID: playlistID,
          trackID: trackID
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaylist({
        ...playlist,
        tracks: playlist.tracks.filter(track => track._id !== trackID)
      });
      toast.success('Track removed from playlist.');
    } catch (error) {
      console.error('Error removing track from playlist:', error);
    }
  };

  if (!playlist) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar/>
      <div className="playlist-page">
            <div className="playlist-info">
                <h1>{playlist.name}</h1>
                <p>By {playlist.owner}</p>
                <p>{playlist.tracks.length} Tracks</p>
            </div>
            <button onClick={navigateToRecommendations} className="find-more-songs-button">Find More Songs</button>
            <ul className="playlist-track-list">
                {playlist.tracks.map(track => (
                    <li key={track._id} className="playlist-track-item">
                      <div className="playlist-track-info-container" onClick={() => goToSongDetails(track._id)}>
                          <img className= 'playlist-track-image' src={track.album.imageURL} alt={track.name}/>
                          <div className='playlist-track-info'>
                            <p className='playlist-track-name'>{track.name}</p>
                            <p className='playlist-track-artist'>Artist: {track.artists.map(artist => artist.name).join(', ')}</p>
                            <p className='playlist-track-album'>Album: {track.album.name}</p>
                            <p className="playlist-track-duration">{Math.floor(track.durationMS / 60000)}:{Math.floor((track.durationMS % 60000) / 1000).toFixed(0).padStart(2, '0')}</p>
                          </div>
                      </div>
                        <button onClick={() => removeTrackFromPlaylist(track._id)} className="playlist-remove-track-button">
                            <FaTrashAlt />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);
};

export default PlaylistPage;