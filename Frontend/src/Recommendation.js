import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { getTrackInfo } from './getTrackInfo';
import './Recommendation.css';
import Navbar from './Navbar';

const Recommendation = () => {
    const [activeTab, setActiveTab] = useState('followedUsers');
    
    const [showInputCard, setShowInputCard] = useState(false);
    const [trackNum, setTrackNum] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const history = useHistory();
    const [recommendingUser, setRecommendingUser] = useState('');

    const [userRatingsRecommendations, setUserRatingsRecommendations] = useState([]);

    const [temporalRecommendation, setTemporalRecommendation] = useState(null);

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
                setRecommendingUser(response.data.message);
            } else {
                alert('Failed to fetch recommendations.');
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            alert('An error occurred while fetching recommendations.');
        }
    };

    const fetchUserRatingsRecommendations = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/recommendation/recommendTrackFromUserRatings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response);
            if (response.data) {
                const detailedTracks = await Promise.all(
                    response.data.mostPopularTracks.map(async track => {
                        return await getTrackInfo(token, track._id);
                    })
                );
                setUserRatingsRecommendations(detailedTracks);
            } else {
                alert('Failed to fetch user ratings recommendations.');
            }
        } catch (error) {
            console.error('Error fetching user ratings recommendations:', error);
            alert('An error occurred while fetching recommendations.');
        }
    };

    const fetchTemporalRecommendations = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/recommendation/recommendTrackFromTemporal', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.randomTrack) {
                const detailedTrack = await getTrackInfo(token, response.data.randomTrack._id);
                setTemporalRecommendation({ ...detailedTrack, artistName: response.data.artistName });
            } else {
                alert('Failed to fetch temporal recommendation.');
            }
        } catch (error) {
            console.error('Error fetching temporal recommendation:', error);
            alert('An error occurred while fetching the temporal recommendation.');
        }
    };

    const handleGetRecommendations = () => {
        if (!trackNum || trackNum === '') {
            alert('Please enter the number of tracks.');
            return;
        }
        fetchRecommendations();
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'followedUsers':
                return (
                    <div>
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
                        {recommendingUser && <h3 className="recommending-user-header">{recommendingUser}</h3>}
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
                );
            case 'userRatings':
                case 'userRatings':
                return (
                    <div>
                        <button className="get-recommendation-button" onClick={fetchUserRatingsRecommendations}>
                            Get Recommendation
                        </button>
                        <div className="recommendation-results">
                            {userRatingsRecommendations.map(item => (
                                <div key={item._id} className="track-card" onClick={() => goToSongDetails(item._id)}>
                                    <img src={item.album.imageURL || 'default-image-url.jpg'} alt={item.name} />
                                    <div>
                                        <p>{item.name}</p>
                                        <p>Artists: {item.artists.map(artist => artist.name).join(', ')}</p>
                                        <a href={item.spotifyURL} target="_blank" rel="noopener noreferrer">Listen on Spotify</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'temporal':
                return (
                    <div>
                        <button className="get-recommendation-button" onClick={fetchTemporalRecommendations}>Get Temporal Recommendation</button>
                        <p></p>
                        <div className="centered-track-card">
                            {temporalRecommendation && (
                                <div className="track-card" onClick={() => goToSongDetails(temporalRecommendation._id)}>
                                    <img src={temporalRecommendation.album?.imageURL || 'default-image-url.jpg'} alt={temporalRecommendation.name} />
                                    <div>
                                        <p>{temporalRecommendation.name}</p>
                                        <p>Artist: {temporalRecommendation.artistName || 'Unknown Artist'}</p>
                                        <a href={temporalRecommendation.spotifyURL} target="_blank" rel="noopener noreferrer">Listen on Spotify</a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <Navbar/>
            <div className="recommendation-container">
                <h2 className="recommendation-header">Ready to expand your taste, {username}?</h2>
                <div className="tabs">
                    <button 
                      className={`tab ${activeTab === 'followedUsers' ? 'active' : ''}`} 
                      onClick={() => setActiveTab('followedUsers')}>
                        Recommendation from Followed Users
                    </button>
                    <button 
                      className={`tab ${activeTab === 'userRatings' ? 'active' : ''}`} 
                      onClick={() => setActiveTab('userRatings')}>
                        Recommendation from User Ratings
                    </button>
                    <button 
                      className={`tab ${activeTab === 'temporal' ? 'active' : ''}`} 
                      onClick={() => setActiveTab('temporal')}>
                        Recommendation from Temporal
                    </button>
                </div>
                {renderTabContent()}
            </div>
        </div>
    );
};

export default Recommendation;
