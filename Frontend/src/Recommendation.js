import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { getTrackInfo } from './getTrackInfo';
import './Recommendation.css';
import Navbar from './Navbar';

const Recommendation = () => {
    const [showInputCard, setShowInputCard] = useState(false);
    const [trackNum, setTrackNum] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const history = useHistory();
    
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const goToSongDetails = (songId) => {
      history.push(`/song/${songId}`);
    };

    const toggleInputCard = () => {
      setShowInputCard(!showInputCard);
    };

    const fetchRecommendations = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/recommendation/recommendTrackFromFollowedUser/${trackNum}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                const detailedRecommendations = await Promise.all(response.data.recommendations.map(async item => {
                    const detailedTrack = await getTrackInfo(token, item.track._id);
                    return { ...item, track: detailedTrack };
                }));
                setRecommendations(detailedRecommendations);
            } else {
                alert('Failed to fetch recommendations.');
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            alert('An error occurred while fetching recommendations.');
        }
    };

    const handleGetRecommendations = () => {
        if (!trackNum || trackNum === '') {
            alert('Please enter the number of tracks.');
            return;
        }
        fetchRecommendations();
    };

    return (
        <div>
        <Navbar/>
        <div className="recommendation-container">
            <h2 className="recommendation-header">Ready to expand your taste, {username}?</h2>
            <button className="get-recommendation-button" onClick={toggleInputCard}>Get Recommendation</button>

            {showInputCard && (
                <div className="input-card">
                    <input
                        type="number"
                        value={trackNum}
                        onChange={(e) => setTrackNum(e.target.value)}
                        placeholder="Enter number of tracks"
                    />
                    <button onClick={handleGetRecommendations}>Get Songs</button>
                </div>
            )}
            <div className="recommendation-results">
                {recommendations.map(item => (
                    <div key={item.track._id} className="track-card" onClick={() => goToSongDetails(item.track._id)}>
                        <img src={item.track.album.imageURL || 'default-image-url.jpg'} alt={item.track.name} />
                        <div>
                            <p>{item.track.name}</p>
                            <p>Artists: {item.track.artists.map(artist => artist.name).join(', ')}</p>
                            <a href={item.track.spotifyURL} target="_blank" rel="noopener noreferrer">Listen on Spotify</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default Recommendation;
