import { useState } from "react";
import SongList from "./SongList";

const Home = () => {

  const[songs, setSongs] = useState([
    { title: "Waves Of Blue", album: "Wildest Dreams", artist: "Majid Jordan", id: 1 },
    { title: "After Hours", album: "After Hours" , artist: "The Weeknd", id: 2 },
    { title: "Ghost", album: "Justice", artist: "Justin Bieber", id: 3 },
    { title: "Company", album: "Purpose", artist: "Justin Bieber", id: 4 }
  ]);

  const handleDelete = (id) => {
    const newSongs = songs.filter(song => song.id !== id);
    setSongs(newSongs);
  }

  return ( 
    <div className="home">
      <SongList songs = {songs} title = "Liked Songs" handleDelete={handleDelete}/>
      <SongList songs = {songs.filter( (song) => song.artist === "Justin Bieber")} title = "Liked Songs by Justin Bieber"/>
    </div>
  );
}
 
export default Home;