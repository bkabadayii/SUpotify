import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LikedContent.css';
import { FaTrashAlt } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

const LikedContent = () => {
  const [activeTab, setActiveTab] = useState('likedSongs');
  const [likedSongs, setLikedSongs] = useState([]);
  const [likedAlbums, setLikedAlbums] = useState([]);
  const [likedArtists, setLikedArtists] = useState([]);
  const history = useHistory();

  const [isCardVisible, setIsCardVisible] = useState(false);
  const [trackName, setTrackName] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [artists, setArtists] = useState('');

  const [isCardOpen, setIsCardOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [filterInput, setFilterInput] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const token = localStorage.getItem('token');

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = 'Track Name,Album Name,Artist Names\n';
    csvContent += headers;

    filteredSongs.forEach(song => {
      const row = [
        song.track.name, 
        song.track.album.name, 
        song.track.artists.map(artist => artist.name).join(',')
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "liked_songs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilterInputChange = (e) => {
    setFilterInput(e.target.value);
  };

  const applyFilter = () => {
    const lowercasedFilter = filterInput.toLowerCase();
    const filtered = likedSongs.filter(item => {
      return item.track.name.toLowerCase().includes(lowercasedFilter) ||
             item.track.artists.some(artist => artist.name.toLowerCase().includes(lowercasedFilter)) ||
             item.track.album.name.toLowerCase().includes(lowercasedFilter);
    });
    setFilteredSongs(filtered);
  };

  const resetFilter = () => {
    setFilteredSongs([]);
    setFilterInput('');
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const parseCSV = (text) => {
    const rows = text.split('\n');
    const headers = rows[0].split(',');
    return rows.slice(1).map(row => {
      const values = row.split(',');
      const entry = {};
      headers.forEach((header, index) => {
        entry[header.trim()] = values[index].trim();
      });
      return entry;
    });
  };  

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }
  
    try {
      const fileReader = new FileReader();
      fileReader.readAsText(selectedFile, "UTF-8");
      fileReader.onload = async e => {
        try {
          const text = e.target.result;
          const data = parseCSV(text);
          console.log(data);
          const token = localStorage.getItem('token');
          const response = await axios.post(
            'http://localhost:4000/api/likedContent/addManyToLikedTracks', 
            { trackList: data }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log(response.data); // Handle the response as needed
          alert(response.data.message);
          fetchLikedContent('TRACK');
        } catch (apiError) {
          console.error('Error sending data to the server:', apiError);
          alert('Error occurred while sending data to the server.');
        }
      };
      fileReader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('Error reading the file.');
      };
    } catch (error) {
      console.error('Error processing file:', error);
      alert('An error occurred while processing the file.');
    }
  };
  

  const handleAddCustomSong = async () => {
    try {
      await axios.post('http://localhost:4000/api/likedContent/likeCustomTrack', {
        trackName, 
        albumName, 
        artists: artists.split(',').map(artist => artist.trim()) // Split by comma and trim spaces
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Custom song added successfully!");
      // Reset the form and hide the card

      fetchLikedContent('TRACK');

      setTrackName('');
      setAlbumName('');
      setArtists('');
      setIsCardVisible(false);
    } catch (error) {
      console.error('Error adding custom song:', error);
      alert('Error adding custom song');
    }
  };

  useEffect(() => {
    if (activeTab === 'likedSongs') {
      fetchLikedContent('TRACK');
    } else if (activeTab === 'likedAlbums') {
      fetchLikedContent('ALBUM');
    } else if (activeTab === 'likedArtists') {
      fetchLikedContent('ARTIST');
    }
    // Add similar condition for likedArtists if needed
  }, [token, activeTab]);

  const goToSongDetails = (songId) => {
    history.push(`/song/${songId}`);
  };

  const goToAlbumDetails = (albumId) => {
    history.push(`/album/${albumId}`);
  };

  const goToArtistDetails = (artistId) => {
    history.push(`/artist/${artistId}`);
  };

  const fetchLikedContent = async (contentType) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/likedContent/getLikedContent/${contentType}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (contentType === 'TRACK') {
        setLikedSongs(response.data.likedContent);
      } else if (contentType === 'ALBUM') {
        setLikedAlbums(response.data.likedContent);
      } else if (contentType === 'ARTIST') {
        setLikedArtists(response.data.likedContent);
      }
      // Add similar condition for likedArtists if needed
    } catch (error) {
      console.error(`Error fetching liked ${contentType.toLowerCase()}:`, error);
    }
  };

  const removeLikedContent = async (contentId, contentType, event) => {
    event.stopPropagation()
    try {
      const response = await axios.delete('http://localhost:4000/api/likedContent/removeFromLikedContent', {
        data: {
          contentID: contentId,
          contentType: contentType
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);
      fetchLikedContent(contentType);
    } catch (error) {
      console.error('Error removing content:', error);
    }
  };

  return (
    <div className="liked-content">
      <div className="tabs">
        <button onClick={() => setActiveTab('likedSongs')} className={activeTab === 'likedSongs' ? 'active' : ''}>Liked Songs</button>
        <button onClick={() => setActiveTab('likedAlbums')} className={activeTab === 'likedAlbums' ? 'active' : ''}>Liked Albums</button>
        <button onClick={() => setActiveTab('likedArtists')} className={activeTab === 'likedArtists' ? 'active' : ''}>Liked Artists</button>
      </div>
      <div className="tab-content">
        {activeTab === 'likedSongs' && (
          <div>
            <div className="add-custom-song">
              <button onClick={() => setIsCardVisible(!isCardVisible)}>Add Custom Song</button>
              {isCardVisible && (
                <div className="custom-song-card">
                  <input
                    type="text"
                    value={trackName}
                    onChange={(e) => setTrackName(e.target.value)}
                    placeholder="Track Name"
                  />
                  <input
                    type="text"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    placeholder="Album Name"
                  />
                  <input
                    type="text"
                    value={artists}
                    onChange={(e) => setArtists(e.target.value)}
                    placeholder="Artists (comma separated)"
                  />
                  <button onClick={handleAddCustomSong}>Submit</button>
                </div>
              )}
            </div>
            <div className="add-tracks-by-file">
              <button onClick={() => setIsCardOpen(!isCardOpen)}>Add A File (.csv)</button>
              {isCardOpen && (
                <div className="upload-card">
                  <input type="file" onChange={handleFileChange} accept=".csv" />
                  <button onClick={handleSubmit}>Submit</button>
                </div>
              )}
            </div>
            <h2 className='content-header'>Liked Tracks</h2>
            <button className="export-songs-button" onClick={exportToCSV}>
              Export Songs
            </button>
            {/* Filter Button and Card */}
            <button className="filter-songs-button" onClick={() => setIsFilterVisible(!isFilterVisible)}>Filter Songs</button>
            {isFilterVisible && (
              <div className="filter-card">
                <input
                  type="text"
                  value={filterInput}
                  onChange={handleFilterInputChange}
                  placeholder="Filter by name, artist, album"
                />
                <button onClick={applyFilter}>Apply Filter</button>
                <button onClick={resetFilter}>Reset</button>
              </div>
            )}
            <ul>
              {(filteredSongs.length > 0 ? filteredSongs : likedSongs).map(item => (
                <li key={item.track._id} onClick={() => goToSongDetails(item.track._id)}>
                  <img src={item.track.album.imageURL} alt={item.track.name} />
                  <div>
                    <p>{item.track.name}</p>
                    <p>Artist: {item.track.artists.map(artist => artist.name).join(', ')}</p>
                    <p>Album: {item.track.album.name}</p>
                    <a href={item.track.spotifyURL} target="_blank" rel="noopener noreferrer">Listen on Spotify</a>
                    <button
                      className="remove-content-button"
                      onClick={(event) => removeLikedContent(item.track._id, 'TRACK', event)}
                    >
                      <FaTrashAlt className="icon" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'likedAlbums' && (
          <div>
            <h2>Liked Albums</h2>
            <ul>
              {likedAlbums.map(item => (
                <li key={item.album._id} onClick={() => goToAlbumDetails(item.album._id)}>
                  <img src={item.album.imageURL} alt={item.album.name} />
                  <div>
                    <p>{item.album.name}</p>
                    <p>Artist: {item.album.artists.map(artist => artist.name).join(', ')}</p>
                    <a href={item.album.spotifyURL} target="_blank" rel="noopener noreferrer">Listen on Spotify</a>
                    <button
                      className="remove-content-button"
                      onClick={() => removeLikedContent(item.album._id, 'ALBUM')}
                    >
                      <FaTrashAlt className="icon" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'likedArtists' && (
          <div>
            <h2>Liked Artists</h2>
            <ul>
              {likedArtists.map(item => (
                <li key={item.artist._id} onClick={() => goToArtistDetails(item.artist._id)}>
                  <img src={item.artist.imageURL} alt={item.artist.name} />
                  <div>
                    <p>{item.artist.name}</p>
                    <p>Genres: {item.artist.genres.join(', ')}</p>
                    <a href={item.artist.spotifyURL} target="_blank" rel="noopener noreferrer">Listen on Spotify</a>
                    <button
                      className="remove-content-button"
                      onClick={() => removeLikedContent(item.artist._id, 'ARTIST')}
                    >
                      <FaTrashAlt className="icon" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedContent;
