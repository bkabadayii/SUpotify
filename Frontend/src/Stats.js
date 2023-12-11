import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'chart.js/auto';
import './Stats.css';
import Navbar from './Navbar';
import { Bar } from 'react-chartjs-2';

const genreChartOptions = {
  scales: {
      'y-axis-numAlbums': {
          position: 'left',
          ticks: {
              beginAtZero: true
          }
      },
      'y-axis-avgRating': {
          position: 'right',
          grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
      },
  }
};

const genreLikeChartOptions = {
  scales: {
    yAxes: [{
        ticks: {
            beginAtZero: true
        }
    }]
}
};

const eraChartOptions = {
  scales: {
      'y-axis-numAlbums': {
          position: 'left',
          ticks: {
              beginAtZero: true
          }
      },
      'y-axis-avgRating': {
          position: 'right',
          grid: {
              drawOnChartArea: false,
          },
          ticks: {
              beginAtZero: true
          }
      },
  }
};

const eraLikeChartOptions = {
  scales: {
      yAxes: [{
          ticks: {
              beginAtZero: true
          }
      }]
  }
};

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
  const [artistsInput, setArtistsInput] = useState('');
  const [numItems, setNumItems] = useState();
  
  const [topRatedAlbums, setTopRatedAlbums] = useState(null);
  const [topRatedTracks, setTopRatedTracks] = useState({ trackRatings: [] });
  const [topRatedArtists, setTopRatedArtists] = useState(null);
  const [topRatedGenres, setTopRatedGenres] = useState(null);
  const [topRatedEras, setTopRatedEras] = useState(null);

  const [topLikedTracks, setTopLikedTracks] = useState(null);
  const [topLikedAlbums, setTopLikedAlbums] = useState(null);
  const [topLikedArtists, setTopLikedArtists] = useState(null);
  const [topLikedGenres, setTopLikedGenres] = useState(null);
  const [topLikedEras, setTopLikedEras] = useState(null);

  // Get All Genres:
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');

  // Chart data
  const [genreChartData, setGenreChartData] = useState({});
  const [eraChartData, setEraChartData] = useState({});
  
  const genreChartRef = useRef(null);
  const eraChartRef = useRef(null);

  const token = localStorage.getItem('token');

  const exportCharts = () => {
    // Export the genre chart
    if (genreChartRef.current) {
      const genreChartUrl = genreChartRef.current.toBase64Image();
      const genreLink = document.createElement('a');
      genreLink.href = genreChartUrl;
      genreLink.download = 'genre-chart.png';
      genreLink.click();
    }
  
    // Export the era chart
    if (eraChartRef.current) {
      const eraChartUrl = eraChartRef.current.toBase64Image();
      const eraLink = document.createElement('a');
      eraLink.href = eraChartUrl;
      eraLink.download = 'era-chart.png';
      eraLink.click();
    }
  };


  const fetchGenres = async (contentType, source) => {
    console.log(`Fetching genres for contentType: ${contentType}, source: ${source}`);
    try {
      const response = await axios.get(`http://localhost:4000/api/statistics/getAllGenres/${contentType}/${source}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setGenres(response.data.genres); // Update your state with the fetched genres
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchArtists = async (contentType, source) => {
    console.log(`Fetching artists for contentType: ${contentType}, source: ${source}`);
    try {
      const response = await axios.get(`http://localhost:4000/api/statistics/getAllArtists/${contentType}/${source}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setArtists(response.data.artists); // Update your state with the fetched artists
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  useEffect(() => {
    // Fetch genres for the default content type (tracks) when the component mounts
    fetchGenres('TRACK', 'RATINGS');
    fetchArtists('TRACK', 'RATINGS');
  }, []);

  const handleContentTypeChange = (e) => {
    const selectedType = e.target.value;
    setSelectedContentType(selectedType);

    let apiContentType;
    switch (selectedType) {
      case 'tracks':
        apiContentType = 'TRACK';
        break;
      case 'albums':
        apiContentType = 'ALBUM';
        break;
      case 'artists':
        apiContentType = 'ARTIST';
        break;
      default:
        console.error('Unknown content type:', selectedType);
        return;
    }

    fetchGenres(apiContentType, 'RATINGS');
    fetchArtists(apiContentType, 'RATINGS');
  };

  const handleLikedContentTypeChange = (e) => {
    const selectedType = e.target.value;
    setSelectedLikedContentType(selectedType);

    let apiContentType;
    switch (selectedType) {
      case 'tracks':
        apiContentType = 'TRACK';
        break;
      case 'albums':
        apiContentType = 'ALBUM';
        break;
      case 'artists':
        apiContentType = 'ARTIST';
        break;
      default:
        console.error('Unknown content type:', selectedType);
        return;
    }

    fetchGenres(apiContentType, 'LIKES');
    fetchArtists(apiContentType, 'LIKES');
  };

  const handleArtistsInputChange = (e) => {
    setArtistsInput(e.target.value);
  };

  const handleArtistChange = (e) => {
    setSelectedArtist(e.target.value);
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
                    console.log(response);
                    setTopLikedTracks(response.data.likedContentList);
                    setTopLikedEras(response.data.eraToStatistics);
                    setTopLikedGenres(response.data.genreToStatistics);

                    setGenreChartData({
                      labels: Object.keys(response.data.genreToStatistics),
                      datasets: [{
                          label: 'Number of Items',
                          data: Object.values(response.data.genreToStatistics).map(data => data.numItems),
                          backgroundColor: 'rgba(54, 162, 235, 0.5)',
                          borderColor: 'rgba(54, 162, 235, 1)',
                          borderWidth: 1,
                          yAxisID: 'y-axis-numAlbums',
                     }]
                    })

                    setEraChartData({
                      labels: Object.keys(response.data.eraToStatistics),
                      datasets: [{
                          label: 'Number of Items',
                          data: Object.values(response.data.eraToStatistics).map(data => data.numItems),
                          backgroundColor: 'rgba(153, 102, 255, 0.5)',
                          borderColor: 'rgba(153, 102, 255, 1)',
                          borderWidth: 1
                      }]
                    })


              
                    break;
                case 'ALBUM':
                    console.log(response);
                    setTopLikedAlbums(response.data.likedContentList);
                    setTopLikedEras(response.data.eraToStatistics);
                    setTopLikedGenres(response.data.genreToStatistics);

                    setGenreChartData({
                      labels: Object.keys(response.data.genreToStatistics),
                      datasets: [{
                          label: 'Number of Items',
                          data: Object.values(response.data.genreToStatistics).map(data => data.numItems),
                          backgroundColor: 'rgba(54, 162, 235, 0.5)',
                          borderColor: 'rgba(54, 162, 235, 1)',
                          borderWidth: 1,
                          yAxisID: 'y-axis-numAlbums',
                     }]
                  })

                  setEraChartData({
                    labels: Object.keys(response.data.eraToStatistics),
                    datasets: [{
                        label: 'Number of Items',
                        data: Object.values(response.data.eraToStatistics).map(data => data.numItems),
                        backgroundColor: 'rgba(153, 102, 255, 0.5)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    }]
                  })

                    break;
                case 'ARTIST':
                    console.log(response);
                    setTopLikedArtists(response.data.likedContentList);
                    setTopLikedEras(response.data.eraToStatistics);
                    setTopLikedGenres(response.data.genreToStatistics);

                    setGenreChartData({
                      labels: Object.keys(response.data.genreToStatistics),
                      datasets: [{
                          label: 'Number of Items',
                          data: Object.values(response.data.genreToStatistics).map(data => data.numItems),
                          backgroundColor: 'rgba(54, 162, 235, 0.5)',
                          borderColor: 'rgba(54, 162, 235, 1)',
                          borderWidth: 1,
                          yAxisID: 'y-axis-numAlbums',
                     }]
                    })

                    setEraChartData({
                      labels: Object.keys(response.data.eraToStatistics),
                      datasets: [{
                          label: 'Number of Items',
                          data: Object.values(response.data.eraToStatistics).map(data => data.numItems),
                          backgroundColor: 'rgba(153, 102, 255, 0.5)',
                          borderColor: 'rgba(153, 102, 255, 1)',
                          borderWidth: 1
                      }]
                    })

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
          artists: [],
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
        
        setGenreChartData({
          labels: Object.keys(response.data.genreToRating),
          datasets: [{
              label: 'Number of Albums',
              data: Object.values(response.data.genreToRating).map(data => data.numAlbums),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              yAxisID: 'y-axis-numAlbums',
         },
         {
          label: 'Average Rating',
          data: Object.values(response.data.genreToRating).map(data => data.avgRating),
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
          yAxisID: 'y-axis-avgRating',
      }
        ]
      })


        setEraChartData({
          labels: Object.keys(response.data.eraToRating),
          datasets: [
              {
                  label: 'Number of Albums',
                  data: Object.values(response.data.eraToRating).map(data => data.numAlbums),
                  backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                  yAxisID: 'y-axis-numAlbums',
              },
              {
                  label: 'Average Rating',
                  data: Object.values(response.data.eraToRating).map(data => data.avgRating),
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1,
                  yAxisID: 'y-axis-avgRating',
              }
          ]
      })



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
          artists: [],
        },
        numItems: numItems // Or another number as per requirement
      }, {
        headers: { Authorization: `Bearer ${token}` } // Ensure token is fetched correctly
      });

      if (response.data.success) {
        setTopRatedTracks(response.data);
        setTopRatedGenres(response.data.genreToRating);
        setTopRatedEras(response.data.eraToRating);
        
        setGenreChartData({
          labels: Object.keys(response.data.genreToRating),
          datasets: [{
              label: 'Number of Tracks',
              data: Object.values(response.data.genreToRating).map(data => data.numTracks),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              yAxisID: 'y-axis-numAlbums',
         },
         {
          label: 'Average Rating',
          data: Object.values(response.data.genreToRating).map(data => data.avgRating),
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
          yAxisID: 'y-axis-avgRating',
      }
        ]
      })
        
      setEraChartData({
        labels: Object.keys(response.data.eraToRating),
        datasets: [
            {
                label: 'Number of Tracks',
                data: Object.values(response.data.eraToRating).map(data => data.numTracks),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                yAxisID: 'y-axis-numAlbums',
            },
            {
                label: 'Average Rating',
                data: Object.values(response.data.eraToRating).map(data => data.avgRating),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                yAxisID: 'y-axis-avgRating',
            }
        ]
    })

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
        
        console.log(response);
        setGenreChartData({
          labels: Object.keys(response.data.genreToRating),
          datasets: [{
              label: 'Number of Artists',
              data: Object.values(response.data.genreToRating).map(data => data.numArtists),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              yAxisID: 'y-axis-numArtists',
         },
         {
          label: 'Average Rating',
          data: Object.values(response.data.genreToRating).map(data => data.avgRating),
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
          yAxisID: 'y-axis-avgRating',
      }
        ]
      })



      } else {
        alert('Failed to fetch top rated artists.');
      }
    } catch (error) {
      console.error('Error fetching top rated artists:', error);
      alert('An error occurred while fetching top rated artists.');
    }
  };







  return (
    <div>
      <Navbar/>
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
                  From:
                  <input
                    type="month"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </label>

                <label>
                  To:
                  <input
                    type="month"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </label>
                
                <label>
                  Release Date (from):
                  <input
                    type="month"
                    value={releaseStartDate}
                    onChange={e => setReleaseStartDate(e.target.value)}
                  />
                </label>

                <label>
                  Release Date (to):
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
              {topRatedAlbums && (
                <div className="top-rated-tracks">
                  <button onClick={exportCharts}>Export Charts</button>
                  <p></p>
                  {genreChartData && (
                  <div>
                    <h3>Genre Statistics of Tracks</h3>
                    <Bar ref={genreChartRef} data={genreChartData} options={genreChartOptions} />
                  </div>
                  )}

                  {eraChartData && (
                  <div>
                    <h3>Era Statistics of Tracks</h3>
                    <Bar ref={eraChartRef} data={eraChartData} options={eraChartOptions} />
                  </div>
                  )}

                  <h3>Top Rated Tracks</h3>
                  <ul className="top-rated-list">
                    {topRatedTracks.trackRatings.map(trackRating => (
                      <li key={trackRating.track._id}>
                        <img src={trackRating.track.album.imageURL} alt={trackRating.track.name} />
                        <p>Name: {trackRating.track.name}</p>
                        <p>Artist: {trackRating.track.artists.map(artist => artist.name).join(', ')}</p>
                        <p>Rating: {trackRating.rating}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            )}

            {selectedContentType === 'albums' && (
            <div className='ratings-flex-container'>
              <form onSubmit={handleRateAlbumSubmit} className="filter-form">
                 <h2>Album Statistics</h2>
                 <label>
                  From:
                  <input
                    type="month"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </label>

                <label>
                  To:
                  <input
                    type="month"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </label>
                
                <label>
                  Release Date (from):
                  <input
                    type="month"
                    value={releaseStartDate}
                    onChange={e => setReleaseStartDate(e.target.value)}
                  />
                </label>

                <label>
                  Release Date (to):
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
                  <button onClick={exportCharts}>Export Charts</button>
                  <p></p>
                  {genreChartData && (
                  <div>
                    <h3>Genre Statistics of Albums</h3>
                    <Bar ref={genreChartRef} data={genreChartData} options={genreChartOptions} />
                  </div>
                  )}

                  {eraChartData && (
                  <div>
                    <h3>Era Statistics of Albums</h3>
                    <Bar ref={eraChartRef} data={eraChartData} options={eraChartOptions} />
                  </div>
                  )}

                  <h3>Top Rated Albums</h3>
                  <ul className="top-rated-list">
                    {topRatedAlbums.albumRatings.map(albumRating => (
                      <li key={albumRating.album._id}>
                        <img src={albumRating.album.imageURL} alt={albumRating.album.name} />
                        <p>Name: {albumRating.album.name}</p>
                        <p>Artist: {albumRating.album.artists.map(artist => artist.name).join(', ')}</p>
                        <p>Rating: {albumRating.rating}</p>
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
                  From:
                  <input
                    type="month"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </label>

                <label>
                  To:
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
                  <button onClick={exportCharts}>Export Charts</button>
                  <p></p>
                  {genreChartData && (
                  <div>
                    <h3>Genre Statistics of Albums</h3>
                    <Bar ref={genreChartRef} data={genreChartData} options={genreChartOptions} />
                  </div>
                  )}
                  <h3>Top Rated Artists</h3>
                  <ul className="top-rated-list">
                    {topRatedArtists.artistRatings.map(artistRating => (
                      <li key={artistRating.artist._id}>
                        <img src={artistRating.artist.imageURL} alt={artistRating.artist.name} />
                        <p>Name: {artistRating.artist.name}</p>
                        <p>Genres: {artistRating.artist.genres.join(', ')}</p>
                        <p>Rating: {artistRating.rating}</p>
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
                  From:
                  <input
                    type="month"
                    value={likedStartDate}
                    onChange={e => setLikedStartDate(e.target.value)}
                  />
                </label>

                <label>
                  To:
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
            <div className="top-rated-tracks">
            <button onClick={exportCharts}>Export Charts</button>
            <p></p>
            {genreChartData && (
                  <div>
                    <h3>Genre Statistics of Tracks</h3>
                    <div style={{ width: '800px', height: '500px' }}>
                      <Bar ref={genreChartRef} data={genreChartData} options={genreLikeChartOptions} />
                  </div>
                  </div>
                  )}
            {eraChartData && (
                  <div>
                    <h3>Era Statistics of Tracks</h3>
                    <div style={{ width: '800px', height: '500px' }}>
                      <Bar ref={eraChartRef} data={eraChartData} options={eraLikeChartOptions} />
                  </div>
                  </div>
                  )}
            </div>
            </div>
          )}

          {selectedLikedContentType === 'albums' && (
            <div className='liked-ratings-flex-container'>
            <form onSubmit={(e) => handleLikedContentSubmit(e, 'ALBUM')} className="liked-filter-form">
            <h2>Album Statistics</h2>
                 <label>
                  From:
                  <input
                    type="month"
                    value={likedStartDate}
                    onChange={e => setLikedStartDate(e.target.value)}
                  />
                </label>

                <label>
                  To:
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
            <div className="top-rated-albums">
            <button onClick={exportCharts}>Export Charts</button>
            <p></p>
            {genreChartData && (
                  <div>
                    <h3>Genre Statistics of Albums</h3>
                    <div style={{ width: '800px', height: '500px' }}>
                      <Bar ref={genreChartRef} data={genreChartData} options={genreLikeChartOptions} />
                  </div>
                  </div>
                  )}
            {eraChartData && (
                  <div>
                    <h3>Era Statistics of Albums</h3>
                    <div style={{ width: '800px', height: '500px' }}>
                      <Bar ref={eraChartRef} data={eraChartData} options={eraLikeChartOptions} />
                  </div>
                  </div>
                  )}
            </div>
            </div>
          )}

          {selectedLikedContentType === 'artists' && (
            <div className='liked-ratings-flex-container'>
            <form onSubmit={(e) => handleLikedContentSubmit(e, 'ARTIST')} className="liked-filter-form">
            <h2>Artist Statistics</h2>
                 <label>
                  From:
                  <input
                    type="month"
                    value={likedStartDate}
                    onChange={e => setLikedStartDate(e.target.value)}
                  />
                </label>

                <label>
                  To:
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
            <div className="top-rated-artists">
            <button onClick={exportCharts}>Export Charts</button>
            <p></p>
            {genreChartData && (
                  <div>
                    <h3>Genre Statistics of Artists</h3>
                    <div style={{ width: '800px', height: '500px' }}>
                      <Bar ref={genreChartRef} data={genreChartData} options={genreLikeChartOptions} />
                  </div>
                  </div>
                  )}
            </div>
            </div>
          )}

        </div>
      </div>
      )}
    </div>
    </div>
  );
};

export default Stats;
