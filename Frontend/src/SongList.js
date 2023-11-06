const SongList = ({ songs, title, handleDelete }) => {

  return (  
    <div className="song-list">
      <h2>{ title }</h2>
      {songs.map((song) => (
        <div className="song-preview" key={ song.id }>
          <h2>{ song.title }</h2>
          <p>by { song.artist }</p>
          <button onClick={() => handleDelete(song.id)}>I don't like this song</button>
        </div>
      ))}
    </div>
  );
}
 
export default SongList;