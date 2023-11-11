import React from 'react';
import axios from 'axios';

const LikedSongs = () => {

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

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

  return (
    <div>
      <h2>Liked Songs of {username} </h2>
      <p></p>
      <button onClick = { () => createLikedSongs(token) } >Create Liked Songs</button>
    </div>
  );
}

export default LikedSongs;
