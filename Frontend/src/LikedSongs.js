import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LikedSongs.css';

const LikedSongs = () => {

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const [songID, setSongID] = useState('');
  const [file, setFile] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const uploadFile = async () => {
    try {
      // Check if a file is selected
      if (!file) {
        console.error('Please select a file.');
        alert('Please select a file.');
        return;
      }

      // Read the content of the file
      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        const content = e.target.result;

        // Extract song IDs from the content (Assuming each line in the file is a song ID)
        const songIDs = file.name.endsWith('.csv')
        ? content.split(',')
        : content.split('\n').filter(id => id.trim()); // Filter out empty strings
      

        // Send a request to add the songs to liked songs
        const response = await axios.post(
          'http://localhost:4000/api/likedSongs/addManyToUserLikedSongs',
          { songIDList: songIDs },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Handle the response as needed
        console.log(response);
      };

      // Read the file as text
      fileReader.readAsText(file);
    } catch (error) {
      // Handle errors
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.')
    }
  };

  const createLikedSongs = async (token) => {

    try {
      const res = await axios.post('http://localhost:4000/api/likedSongs/createLikedSongsForUser',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the response as needed
      console.log(res.data);
      if(res.success === true)
      {
        alert('Liked songs playlist successfully created!');
      }
      else
      {
        alert('Liked songs already exist for this user.')
      }

    } catch (error) {
      // Handle errors
      console.error('Error creating liked songs for user:', error);
    }

  };

  const addToUserLikedSongs = async () => {
    try {
      const res = await axios.post(
        'http://localhost:4000/api/likedSongs/addToUserLikedSongs',
        {
          songID: songID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the response as needed
      console.log(res.data);

      if (res.data.success === true)
      {
        alert('Added to Liked Songs!')
      }
      else
      {
        alert('Song already exists in Liked Songs.')
      }

    } catch (error) {
      // Handle errors
      console.error('Error adding song to user liked songs:', error);
    }
  };

  useEffect(() => {
    const getLikedSongsForUser = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4000/api/likedSongs/getLikedSongsForUser',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update state with the liked songs list
        if (response.data && response.data.likedSongs && Array.isArray(response.data.likedSongs.likedSongsList)) {
          setLikedSongs(response.data.likedSongs.likedSongsList);
        } else {
          console.error('Expected an array of songs, but received:', response.data);
        }
      } catch (error) {
        console.error('Error fetching liked songs:', error);
      }
    };

    getLikedSongsForUser();
  }, [token]);
  

  const removeFromLikedSongs = async (songId) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/likedSongs/removeFromUserLikedSongs',
        { songID: songId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Response:', response.data);
  
      // Check if the removal was successful
      if (response.data.success) {
        // Update the UI by filtering out the removed song
        const updatedSongs = likedSongs.filter((song) => song._id !== songId);
        setLikedSongs(updatedSongs);
        alert('Successfully removed from liked songs.');
      } else {
        console.error('Failed to remove the song:', response.data.message);
        alert('Failed to remove the song.');
      }
    } catch (error) {
      console.error('Error removing song from liked songs:', error);
      alert('An error occurred while removing the song. Check the console for more details.');
    }
  };
  

  return (
    <div>
      <h2>Add Songs </h2>
      <p></p>
      <button className="create-liked-songs-button" onClick={() => createLikedSongs(token)}>
        Create Liked Songs
      </button>
      <p></p>
      <div className="input-with-button">
        <input
          type='text'
          className="input-field"
          placeholder='Enter Song ID'
          value={songID}
          onChange={(e) => setSongID(e.target.value)}
        />
        <button className="add-to-liked-songs-button" onClick={addToUserLikedSongs}>
          Add to Liked Songs
        </button>
      </div>
      <p></p>
      <div className="input-with-button">
        <input
          type="file"
          className="input-field"
          onChange={handleFileChange}
        />
        <button className="upload-file-button" onClick={uploadFile}>
          Upload File
        </button>
      </div>
      <p></p>
      <h2>Liked Songs of {username} </h2>
      <p></p>
      <ul>
        {likedSongs.map((song) => (
          <li key={song._id} className="liked-song-item">
            <img
              src={song.album.imageURL}
              alt={`Album cover for ${song.album.name}`}
              className="album-cover" // Add this class if you want to style the images
            />
            <span className="liked-song-name">
              {song.name} by {song.artists.map(artist => artist.name).join(', ')}
            </span>
            <button
              onClick={() => removeFromLikedSongs(song._id)}
              className="dislike-button"
            >
              Dislike
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LikedSongs;
