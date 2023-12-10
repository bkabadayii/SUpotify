import React, { useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import { generateBarChart } from './ChartGenerator';
import 'chart.js/auto';
import './Stats.css';

const Stats = () => {
  const [activeTab, setActiveTab] = useState('ratings');
  const [selectedContentType, setSelectedContentType] = useState('tracks');
  const [selectedLikedContentType, setSelectedLikedContentType] = useState('tracks');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [likedStartDate, setLikedStartDate] = useState('');
  const [likedEndDate, setLikedEndDate] = useState('');
  const [releaseStartDate, setReleaseStartDate] = useState('');
  const [releaseEndDate, setReleaseEndDate] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [artistsInput, setArtistsInput] = useState('');
  const [numItems, setNumItems] = useState();
  
  const [topRatedAlbums, setTopRatedAlbums] = useState(null);
  const [topRatedTracks, setTopRatedTracks] = useState(null);
  const [topRatedArtists, setTopRatedArtists] = useState(null);
  const [topRatedGenres, setTopRatedGenres] = useState(null);
  const [topRatedEras, setTopRatedEras] = useState(null);

  const [topLikedTracks, setTopLikedTracks] = useState(null);
  const [topLikedAlbums, setTopLikedAlbums] = useState(null);
  const [topLikedArtists, setTopLikedArtists] = useState(null);
  const [topLikedGenres, setTopLikedGenres] = useState(null);
  const [topLikedEras, setTopLikedEras] = useState(null);


  // Static arrays for genres and artists
  const genres = ['hip hop', 'rap', 'pop', 'dance pop', 'uk pop'];

  const token = localStorage.getItem('token');

  const handleContentTypeChange = (e) => {
    setSelectedContentType(e.target.value);
  };

  const handleLikedContentTypeChange = (e) => {
    setSelectedLikedContentType(e.target.value);
  };

  const handleArtistsInputChange = (e) => {
    setArtistsInput(e.target.value);
  };

  const handleArtistChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedArtists(value);
  };

  const getChartData = () => {
    const data = [
        ['Genre', 'Number of Tracks', 'Average Rating']
    ];

    if (topRatedGenres) {
        Object.entries(topRatedGenres).forEach(([genre, { numTracks, avgRating }]) => {
            data.push([genre, numTracks, parseFloat(avgRating)]);
        });
    }

    return data;
  };

  const handleLikedContentSubmit = async (e, contentType) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:4000/api/statistics/getLikedContentStatistics', {
            filters: {
                likeDate: [likedStartDate, likedEndDate],
                genres: selectedGenre ? [selectedGenre] : []
            },
            numItems: numItems,
            contentType: contentType
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(response);

        if (response.data.success) {
            // Depending on the contentType, update the respective state
            // For example, if contentType is 'TRACK', you might want to set a state for likedTracks
            // This is an example, adjust based on your application's structure
            switch (contentType) {
                case 'TRACK':
                    setTopLikedTracks(response.data.likedContentList);
                    setTopLikedEras(response.data.eraToStatistics);
                    setTopLikedGenres(response.data.genreToStatistics);
                    break;
                case 'ALBUM':
                    setTopLikedAlbums(response.data.likedContentList);
                    setTopLikedEras(response.data.eraToStatistics);
                    setTopLikedGenres(response.data.genreToStatistics);
                    break;
                case 'ARTIST':
                    setTopLikedArtists(response.data.likedContentList);
                    setTopLikedEras(response.data.eraToStatistics);
                    setTopLikedGenres(response.data.genreToStatistics);
                    break;
                default:
                    break;
            }
        } else {
            alert('Failed to fetch liked content statistics.');
        }
    } catch (error) {
        console.error('Error fetching liked content statistics:', error);
        alert('An error occurred while fetching liked content statistics.');
    }
};

  const handleRateAlbumSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/statistics/getTopRatedAlbums', {
        filters: {
          rateDate: [startDate, endDate],
          releaseDate: [releaseStartDate, releaseEndDate],
          genres: selectedGenre ? [selectedGenre] : [],
          artists: []
        },
        numItems: numItems
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(response);

      if (response.data.success) {
        setTopRatedAlbums(response.data);
        setTopRatedEras(response.data.eraToRating);
        setTopRatedGenres(response.data.genreToRating);
      } else {
        alert('Failed to fetch top rated albums.');
      }
    } catch (error) {
      console.error('Error fetching top rated albums:', error);
      alert('An error occurred while fetching top rated albums.');
    }
  };

  const handleRateTrackSubmit = async (e) => {
    e.preventDefault();
    try {
      const processedArtists = artistsInput.split(',')
      .map(artist => artist.trim())
      .filter(artist => artist !== '');

      const response = await axios.post('http://localhost:4000/api/statistics/getTopRatedTracks', {
        filters: {
          rateDate: [startDate, endDate],
          releaseDate: [releaseStartDate, releaseEndDate],
          genres: selectedGenre ? [selectedGenre] : [],
          artists: processedArtists
        },
        numItems: numItems // Or another number as per requirement
      }, {
        headers: { Authorization: `Bearer ${token}` } // Ensure token is fetched correctly
      });

      console.log(response);

      if (response.data.success) {
        setTopRatedTracks(response.data);
        setTopRatedGenres(response.data.genreToRating);
        setTopRatedEras(response.data.eraToRating);

        console.log(topRatedTracks);
        console.log(topRatedGenres);
        console.log(topRatedEras);
      } else {
        alert('Failed to fetch top rated tracks.');
      }
    } catch (error) {
      console.error('Error fetching top rated tracks:', error);
      alert('An error occurred while fetching top rated tracks.');
    }
  };

  const handleRateArtistSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/statistics/getTopRatedArtists', {
        filters: {
          rateDate: [startDate, endDate],
          genres: selectedGenre ? [selectedGenre] : [],
        },
        numItems: numItems // Or another number as per requirement
      }, {
        headers: { Authorization: `Bearer ${token}` } // Ensure token is fetched correctly
      });

      console.log(response);

      if (response.data.success) {
        setTopRatedArtists(response.data);
        setTopRatedGenres(response.data.genreToRating);
      } else {
        alert('Failed to fetch top rated artists.');
      }
    } catch (error) {
      console.error('Error fetching top rated artists:', error);
      alert('An error occurred while fetching top rated artists.');
    }
  };

  return (
    <div className="stats-container">
      <div className="main-tabs">
        <button
          onClick={() => setActiveTab('ratings')}
          className={activeTab === 'ratings' ? 'active' : ''}
        >
          Stats by Ratings
        </button>
        <button
          onClick={() => setActiveTab('liked')}
          className={activeTab === 'liked' ? 'active' : ''}
        >
          Stats by Liked Content
        </button>
      </div>

      {activeTab === 'ratings' && (
        <div className="ratings-container">
          <div className="content-type-selector">
            <label htmlFor="content-type">Select Content Type:</label>
            <select
              id="content-type"
              value={selectedContentType}
              onChange={handleContentTypeChange}
            >
              <option value="tracks">Tracks</option>
              <option value="albums">Albums</option>
              <option value="artists">Artists</option>
            </select>
          </div>
          <div className="ratings-content">

            {selectedContentType === 'tracks' && (
            <div className='ratings-flex-container'>  
              <form onSubmit={handleRateTrackSubmit} className="filter-form">
                 <h2>Track Statistics</h2>
                 <label>
                  Start Date:
                  <input
                    type="month"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </label>

                <label>
                  End Date:
                  <input
                    type="month"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </label>
                
                <label>
                  Release Start Date:
                  <input
                    type="month"
                    value={releaseStartDate}
                    onChange={e => setReleaseStartDate(e.target.value)}
                  />
                </label>

                <label>
                  Release End Date:
                  <input
                    type="month"
                    value={releaseEndDate}
                    onChange={e => setReleaseEndDate(e.target.value)}
                  />
                </label>

                <label>
                  Genres:
                  <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                    <option value="">Select Genre</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </label>

                {/* <label>
                  Artists:
                  <select multiple value={selectedArtists} onChange={handleArtistChange}>
                    {artists.map(artist => (
                      <option key={artist} value={artist}>{artist}</option>
                    ))}
                  </select>
                </label>*/}

                <label>
                  Artists:
                  <input
                    type="text"
                    value={artistsInput}
                    onChange={handleArtistsInputChange}
                    placeholder="Enter artists separated by commas"
                  />
                </label>

                <label>
                  Number of Tracks:
                  <input
                    type="number"
                    value={numItems}
                    onChange={e => setNumItems(e.target.value)}
                    min="1" // Optional: Set minimum value
                  />
                </label>

                <button type="submit">Apply Filters</button>
              </form>
              {topRatedGenres && generateBarChart(topRatedGenres)}
            </div>
            )}

            {selectedContentType === 'albums' && (
            <div className='ratings-flex-container'>
              <form onSubmit={handleRateAlbumSubmit} className="filter-form">
                 <h2>Album Statistics</h2>
                 <label>
                  Start Date:
                  <input
                    type="month"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </label>

                <label>
                  End Date:
                  <input
                    type="month"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </label>
                
                <label>
                  Release Start Date:
                  <input
                    type="month"
                    value={releaseStartDate}
                    onChange={e => setReleaseStartDate(e.target.value)}
                  />
                </label>

                <label>
                  Release End Date:
                  <input
                    type="month"
                    value={releaseEndDate}
                    onChange={e => setReleaseEndDate(e.target.value)}
                  />
                </label>

                <label>
                  Genres:
                  <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                    <option value="">Select Genre</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </label>

                {/* <label>
                  Artists:
                  <select multiple value={selectedArtists} onChange={handleArtistChange}>
                    {artists.map(artist => (
                      <option key={artist} value={artist}>{artist}</option>
                    ))}
                  </select>
                </label>*/}

                <label>
                  Artists:
                  <input
                    type="text"
                    value={artistsInput}
                    onChange={handleArtistsInputChange}
                    placeholder="Enter artists separated by commas"
                  />
                </label>

                <label>
                  Number of Albums:
                  <input
                    type="number"
                    value={numItems}
                    onChange={e => setNumItems(e.target.value)}
                    min="1" // Optional: Set minimum value
                  />
                </label>

                <button type="submit">Apply Filters</button>
              </form>
              {topRatedAlbums && (
                <div className="top-rated-albums">
                  <h3>Top Rated Albums</h3>
                  <ul>
                    {topRatedAlbums.albumRatings.map(albumRating => (
                      <li key={albumRating.album._id}>
                        <img src={albumRating.album.imageURL} alt={albumRating.album.name} />
                        <p>Name: {albumRating.album.name}</p>
                        <p>Artist: {albumRating.album.artists.map(artist => artist.name).join(', ')}</p>
                        <p>Rating: {albumRating.rating}</p>
                        <a href={albumRating.album.spotifyURL} target="_blank" rel="noopener noreferrer">Listen on Spotify</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}  
            </div>
            )}

            {selectedContentType === 'artists' && (
            <div className='ratings-flex-container'>  
              <form onSubmit={handleRateArtistSubmit} className="filter-form">
                 <h2>Artist Statistics</h2>
                 <label>
                  Start Date:
                  <input
                    type="month"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </label>

                <label>
                  End Date:
                  <input
                    type="month"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </label>

                <label>
                  Genres:
                  <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                    <option value="">Select Genre</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </label>

                {/* <label>
                  Artists:
                  <select multiple value={selectedArtists} onChange={handleArtistChange}>
                    {artists.map(artist => (
                      <option key={artist} value={artist}>{artist}</option>
                    ))}
                  </select>
                </label>*/}

                <label>
                  Number of Artists:
                  <input
                    type="number"
                    value={numItems}
                    onChange={e => setNumItems(e.target.value)}
                    min="1" // Optional: Set minimum value
                  />
                </label>

                <button type="submit">Apply Filters</button>
              </form>
              {topRatedArtists && (
                <div className="top-rated-artists">
                  <h3>Top Rated Artists</h3>
                  <ul>
                    {topRatedArtists.artistRatings.map(artistRating => (
                      <li key={artistRating.artist._id}>
                        <img src={artistRating.artist.imageURL} alt={artistRating.artist.name} />
                        <p>Name: {artistRating.artist.name}</p>
                        <p>Genres: {artistRating.artist.genres.join(', ')}</p>
                        <p>Rating: {artistRating.rating}</p>
                        <a href={artistRating.artist.spotifyURL} target="_blank" rel="noopener noreferrer">Listen on Spotify</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>  
            )}

          </div>
        </div>
      )}

      {activeTab === 'liked' && (
        <div className="liked-container">
        <div className="liked-content-type-selector">
          <label htmlFor="liked-content-type">Select Content Type:</label>
          <select
            id="liked-content-type"
            value={selectedLikedContentType}
            onChange={handleLikedContentTypeChange}
          >
            <option value="tracks">Tracks</option>
            <option value="albums">Albums</option>
            <option value="artists">Artists</option>
          </select>
        </div>
        <div className="liked-content">
          {selectedLikedContentType === 'tracks' && (
            <div className='liked-ratings-flex-container'>
            <form onSubmit={(e) => handleLikedContentSubmit(e, 'TRACK')} className="liked-filter-form">
            <h2>Track Statistics</h2>
                 <label>
                  Start Date:
                  <input
                    type="month"
                    value={likedStartDate}
                    onChange={e => setLikedStartDate(e.target.value)}
                  />
                </label>

                <label>
                  End Date:
                  <input
                    type="month"
                    value={likedEndDate}
                    onChange={e => setLikedEndDate(e.target.value)}
                  />
                </label>

                <label>
                  Genres:
                  <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                    <option value="">Select Genre</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Number of Tracks:
                  <input
                    type="number"
                    value={numItems}
                    onChange={e => setNumItems(e.target.value)}
                    min="1" // Optional: Set minimum value
                  />
                </label>

                <button type="submit">Apply Filters</button>
            </form>
            {/* ... other content for liked tracks ... */}
            </div>
          )}

          {selectedLikedContentType === 'albums' && (
            <div className='liked-ratings-flex-container'>
            <form onSubmit={(e) => handleLikedContentSubmit(e, 'ALBUM')} className="liked-filter-form">
            <h2>Album Statistics</h2>
                 <label>
                  Start Date:
                  <input
                    type="month"
                    value={likedStartDate}
                    onChange={e => setLikedStartDate(e.target.value)}
                  />
                </label>

                <label>
                  End Date:
                  <input
                    type="month"
                    value={likedEndDate}
                    onChange={e => setLikedEndDate(e.target.value)}
                  />
                </label>

                <label>
                  Genres:
                  <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                    <option value="">Select Genre</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Number of Albums:
                  <input
                    type="number"
                    value={numItems}
                    onChange={e => setNumItems(e.target.value)}
                    min="1" // Optional: Set minimum value
                  />
                </label>

                <button type="submit">Apply Filters</button>
            </form>
            {/* ... other content for liked tracks ... */}
            </div>
          )}

          {selectedLikedContentType === 'artists' && (
            <div className='liked-ratings-flex-container'>
            <form onSubmit={(e) => handleLikedContentSubmit(e, 'ARTIST')} className="liked-filter-form">
            <h2>Artist Statistics</h2>
                 <label>
                  Start Date:
                  <input
                    type="month"
                    value={likedStartDate}
                    onChange={e => setLikedStartDate(e.target.value)}
                  />
                </label>

                <label>
                  End Date:
                  <input
                    type="month"
                    value={likedEndDate}
                    onChange={e => setLikedEndDate(e.target.value)}
                  />
                </label>

                <label>
                  Genres:
                  <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                    <option value="">Select Genre</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Number of Artists:
                  <input
                    type="number"
                    value={numItems}
                    onChange={e => setNumItems(e.target.value)}
                    min="1" // Optional: Set minimum value
                  />
                </label>

                <button type="submit">Apply Filters</button>
            </form>
            {/* ... other content for liked tracks ... */}
            </div>
          )}

        </div>
      </div>
      )}
    </div>
  );
};

export default Stats;
