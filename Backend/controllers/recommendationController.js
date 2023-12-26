const LikedContent = require("../models/likedContentModel");
const FollowedUsers = require("../models/followedUsersModel");
const {
  isFriend,
} = require("../controllers/followedUsersController");
const UserToRatings= require("../models/userToRatingsModel");
const Track= require("../models/trackModel");


module.exports.recommendTrackFromFollowedUser = async (req,res)=>{   
  try {
    // Get user information from the information coming from verifyToken middleware
    const user = req.user;
    const { username } = user;

    // Get users likedTracks
    const likedContent = await LikedContent.findOne({ username }).populate({
      path: 'likedTracks.track',
      populate: {
        path: 'artists',
        select: 'genres',
      },
    }).lean();

    if (!likedContent || !likedContent.likedTracks || likedContent.likedTracks.length === 0) {
      return res.json({
        message: "No liked tracks found for the user or user doesn't exist.",
        success: false,
      });
    }

    const genreCount = {};

    for (const trackObj of likedContent.likedTracks) {
      const artists = trackObj.track.artists;
      
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
        const followedLikedContentFirst= await LikedContent.findOne({ username: followedUsername })
        const followedLikedContent = await followedLikedContentFirst.populate({
          path: 'likedTracks.track',
          populate: {
            path: 'artists',
            select: 'genres',
          },
        });
        
        const likedContent=await LikedContent.findOne({username});
        
        // Return empty array if followed user does not exist or has no liked songs
        if (!followedLikedContent) {
          console.log('User not found or no liked songs.');
          return [];
        }

        // Filter tracks by the specified genre
        const tracksWithGenre = followedLikedContent.likedTracks.filter(trackList =>
          trackList.track.artists.some(artist => artist.genres.includes(genre))
        );
        
        const existingTrackIds = likedContent.likedTracks.map(trackList => trackList.track._id);
        
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


module.exports.recommendTrackFromUserRatings = async (req, res) => {
  try {
      const user = req.user;
      const { username } = user;

      const topTracks = await getTopRatedTracks(username);
      if (!topTracks || topTracks.length === 0) {
          return res.status(404).json({ message: 'No top rated tracks found for the user.' });
      }

      const commonGenre = await findMostCommonGenre(topTracks);
      if (!commonGenre) {
          return res.status(500).json({ message: 'Error finding common genre.' });
      }

      const mostPopularTrack = await getMostPopularTrackWithGenre(commonGenre);
      if (!mostPopularTrack) {
          return res.status(404).json({ message: 'No most popular track found for the common genre.' });
      }

      return res.status(200).json({ mostPopularTrack });
  } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json({ message: 'Internal server error.' });
  }
};

async function getTopRatedTracks(username) {
  try {
      const userRatings = await UserToRatings.findOne({ username });
      if (!userRatings) {
          throw new Error('User not found');
      }

      const topRatedTracks = userRatings.trackRatings
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 10);

      return topRatedTracks;
  } catch (error) {
      throw error;
  }
}

// Function to find the most common genre in top rated tracks
async function findMostCommonGenre(topTracks) {
  try {
    const trackIds = topTracks.map(track => track.track);

    // Fetch all tracks from the database that match the IDs in the topTracks array
    const tracks = await Track.find({ _id: { $in: trackIds } }).populate('artists');

    // Extract all genres from the fetched tracks
    const allGenres = tracks.reduce((genres, track) => {
        track.artists.forEach(artist => {
            genres.push(...artist.genres);
        });
        return genres;
    }, []);

    // Count occurrences of each genre
    const genreCount = {};
    allGenres.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
    });

    // Find the most common genre
    let mostCommonGenre = '';
    let maxCount = 0;
    for (const genre in genreCount) {
        if (genreCount[genre] > maxCount) {
            mostCommonGenre = genre;
            maxCount = genreCount[genre];
        }
    }
      return mostCommonGenre;
  } catch (error) {
      throw error;
  }
}

async function getMostPopularTrackWithGenre(genre) {
  try {
    // Fetch tracks with the given genre
    const tracksWithGenre = await Track.find({}).populate({
        path: 'artists',
        match: { genres: genre }, // Filter by the specific genre in artists
        select: 'genres',
    });

    // Filter out tracks with no matching genre
    const tracksFilteredByGenre = tracksWithGenre.filter(track => track.artists.length > 0);

    // Get 10 random tracks from the filtered list
    const randomTracks = [];
    while (randomTracks.length < 10 && tracksFilteredByGenre.length > 0) {
        const randomIndex = Math.floor(Math.random() * tracksFilteredByGenre.length);
        const randomTrack = tracksFilteredByGenre.splice(randomIndex, 1)[0];
        randomTracks.push(randomTrack);
    }

    // Sort the random tracks by popularity
    randomTracks.sort((a, b) => b.popularity - a.popularity);

    // Get the most popular track from the sorted list
    const mostPopularTrack = randomTracks.length > 0 ? randomTracks[0] : null;
      return mostPopularTrack;
  } catch (error) {
      throw error;
  }
}