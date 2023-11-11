import React, { useState } from 'react';
import axios from 'axios';

const LikedSongs = () => {

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const [songID, setSongID] = useState('');
  const [songIDList, setSongIDList] = useState([]);

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

  const addManyToUserLikedSongs = async () => {
    try {
      const res = await axios.post(
        'http://localhost:4000/api/likedSongs/addManyToUserLikedSongs',
        {
          songIDList: songIDList,
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
        alert('Songs already exist in Liked Songs.')
      }


    } catch (error) {
      // Handle errors
      console.error('Error adding many songs to user liked songs:', error);
    }
  };

  return (
    <div>
      <h2>Add Songs </h2>
      <p></p>
      <button onClick = { () => createLikedSongs(token) } >Create Liked Songs</button>
      <p></p>
      <input
        type = 'text'
        placeholder = 'Enter Song ID'
        value = { songID }
        onChange={(e) => setSongID(e.target.value)}
      />
      <button onClick={addToUserLikedSongs}>Add to Liked Songs</button>
      <p></p>
      <textarea
        placeholder="Enter Song IDs (comma-separated)"
        value={songIDList.join(',')}
        onChange={(e) => setSongIDList(e.target.value.split(','))}
      />
      <button onClick={addManyToUserLikedSongs}>Add Many to Liked Songs</button>
      <p></p>
      <h2>Liked Songs of {username} </h2>
    </div>
  );
}

export default LikedSongs;
