import React from 'react';
import { useHistory } from 'react-router-dom';

const Home = () => {

  const history = useHistory()

  const goToLikedSongs = () => {
    history.push('likedsongs')
  }

  return (
    <div>
      <button onClick={goToLikedSongs}>Liked Songs</button>
    </div>
  );
}

export default Home;
