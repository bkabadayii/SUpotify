const LikedSongs = require("../models/likedSongsModel");
const FollowedUsers = require("../models/followedUsersModel");
const {
  isFriend,
} = require("../controllers/followedUsersController");


module.exports.recommendTrackFromFollowedUser = async (req,res)=>{   
  try {
    // Get user information from the information coming from verifyToken middleware
    const user = req.user;
    const { username } = user;

    // Get users likedSongsList
    const likedSongs = await LikedSongs.findOne({ username }).populate({
      path: 'likedSongsList',
      populate: {
        path: 'artists',
        select: 'genres',
      },
    }).lean();

    if (!likedSongs || !likedSongs.likedSongsList || likedSongs.likedSongsList.length === 0) {
      return res.json({
        message: "No liked songs found for the user or user doesn't exist.",
        success: false,
      });
    }

    const genreCount = {};

    for (const song of likedSongs.likedSongsList) {
      const artists = song.artists;
      
      if (!artists || !Array.isArray(artists) || artists.length === 0) {
        console.log('No artists or empty artists array found:', song);
        continue; // Skip this song if there are no artists or if artists is not an array
      }

      //Get genres from artists of tracks
      for (const artist of artists) {
        if (artist.genres && Array.isArray(artist.genres) && artist.genres.length > 0) {
          for (const genre of artist.genres) {
            genreCount[genre] = (genreCount[genre] || 0) + 1;
          }
        }
      }
    }

    if (Object.keys(genreCount).length === 0) {
      return res.json({
        message: "No genres found in the liked songs.",
        success: false,
      });
    }
    
    const mostCommonGenre = Object.keys(genreCount).reduce((a, b) =>
      genreCount[a] > genreCount[b] ? a : b
    );

    const currentUser = await FollowedUsers.findOne({ username }); // Find the document with the given username
    let randomFollowedUser;
    if (currentUser) {
      const followedUsersList = currentUser.followedUsersList;
      if (followedUsersList.length > 0) {
        const randomIndex = Math.floor(Math.random() * followedUsersList.length);
        randomFollowedUser = followedUsersList[randomIndex];
      } else {
          return { success: false, message: 'The followed users list is empty.', user };
        }
    } else {
        return { success: false, message: 'User not found.' };
      }

      // Function to find tracks by genre from a user's liked songs
    async function findTracksByGenre(username,followedUsername, genre,trackNum) {
      try {
        // Find the followed user's liked songs list
        const followedLikedSongsFirst= await LikedSongs.findOne({ username: followedUsername })
        const followedLikedSongs = await followedLikedSongsFirst.populate({
          path: 'likedSongsList',
          populate: {
            path: 'artists',
            select: 'genres',
          },
        });
        
        const likedSongs=await LikedSongs.findOne({username});
        
        // Return empty array if followed user does not exist or has no liked songs
        if (!followedLikedSongs) {
          console.log('User not found or no liked songs.');
          return [];
        }

        // Filter tracks by the specified genre
        const tracksWithGenre = followedLikedSongs.likedSongsList.filter(track =>
          track.artists.some(artist => artist.genres.includes(genre))
        );
        
        const existingTrackIds = likedSongs.likedSongsList.map(track => track._id);
        
        //Delete track from recommendation if the recommended track is in users likedSongsList,
        const filteredTracks = tracksWithGenre.filter(track => !existingTrackIds.includes(track._id)); 
        
        filteredTracks.filter((value, index, self) => self.indexOf(value) === index); //Delete duplicate tracks
        filteredTracks.sort(() => Math.random() - 0.5); // Shuffle array

        // Return up to 'trackNum' tracks matching the genre
        return filteredTracks.slice(0, trackNum);
      } catch (error) {
        console.error('Error finding tracks by genre:', error);
        return [];
      }
    }
    
    const { trackNum }= req.params;
    const recommendations= await findTracksByGenre(username, randomFollowedUser, mostCommonGenre,trackNum) ;

    res.status(201).json({
      message: `These tracks are recommended from user: ${randomFollowedUser}`,
      recommendations,
      success: true,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
