const LikedContent = require("../models/likedContentModel");
const FollowedUsers = require("../models/followedUsersModel");
const {
  isFriend,
} = require("../controllers/followedUsersController");
const UserToRatings= require("../models/userToRatingsModel");
const Track= require("../models/trackModel");
const UserToPlaylists=require("../models/userToPlaylistsModel");
const Artist=require("../models/artistModel");
const Album=require("../models/albumModel");


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
      const duplicateFollowedUsersList = [...currentUser.followedUsersList];

      for (let index = 0; index < duplicateFollowedUsersList.length; index++) {
        const currentFollowedUsername = duplicateFollowedUsersList[index];

        // Find the document for the current followed user
        const currentFollowedUserSchema = await FollowedUsers.findOne({ username: currentFollowedUsername });
        const currentFollowedUserLikedContent=await LikedContent.findOne({ username: currentFollowedUsername });

        if (currentFollowedUserSchema) {
          const currentFollowedUsersBlockList = currentFollowedUserSchema.recommendationBlockedUsersList;
          const currentFollowedUsersLikedTracks = currentFollowedUserLikedContent.likedTracks;

          if (currentFollowedUsersBlockList && currentFollowedUsersBlockList.indexOf(username) !== -1) {
            // Delete the followedUser that blocked the user
            duplicateFollowedUsersList.splice(index, 1);
            index--;
          }
          else if(currentFollowedUsersLikedTracks.length==0){
            //Delete the followedUser if their likedTracks are empty
            duplicateFollowedUsersList.splice(index, 1);
            index--;
          }
        }
      }
      
      if (duplicateFollowedUsersList.length > 0) {
          const randomIndex = Math.floor(Math.random() * duplicateFollowedUsersList.length);  
          randomFollowedUser = duplicateFollowedUsersList[randomIndex];
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
          populate: [
            {
              path: 'artists',
              select: 'genres name',
            },
            {
              path: 'album',
              select: '_id imageURL name',
            },
          ],
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

      const mostPopularTracks = await getMostPopularTracksWithGenre(username,commonGenre);
      if (!mostPopularTracks) {
          return res.status(404).json({ message: 'No most popular tracks found for the common genre.' });
      }

      return res.status(200).json({ mostPopularTracks });
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

async function getMostPopularTracksWithGenre(username,genre) {
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
    while (randomTracks.length < 20 && tracksFilteredByGenre.length > 0) {
        const randomIndex = Math.floor(Math.random() * tracksFilteredByGenre.length);
        const randomTrack = tracksFilteredByGenre.splice(randomIndex, 1)[0];
        if(checkIfSeenBefore(username,randomTrack._id)){
        randomTracks.push(randomTrack);
        }
    }

    // Sort the random tracks by popularity
    randomTracks.sort((a, b) => b.popularity - a.popularity);
    return randomTracks;
  } catch (error) {
      throw error;
  }
}
async function checkIfSeenBefore(username, trackId) {
  try {
    const userRatings = await UserToRatings.findOne({ username });
    const likedContent = await LikedContent.findOne({ username });
    const userPlaylists = await UserToPlaylists.findOne({ username });

    if (!userRatings || !likedContent || !userPlaylists) {
      return {
        hasRated: false,
        hasLiked: false,
        addedToPlaylist: false,
      };
    }

    let hasRated = false;
    let hasLiked = false;
    let addedToPlaylist = false;

    if (userRatings.trackRatings) {
      const ratedTrack = userRatings.trackRatings.find(
        (rating) => rating.track.toString() === trackId
      );
      if (ratedTrack) {
        hasRated = true;
      }
    }

    if (likedContent.likedTracks) {
      const likedTrack = likedContent.likedTracks.find(
        (liked) => liked.track.toString() === trackId
      );
      if (likedTrack) {
        hasLiked = true;
      }
    }

    if (userPlaylists.playlists) {
      userPlaylists.playlists.forEach((playlistId) => {
        if (playlistId.tracks) {
          const foundTrack = playlistId.tracks.find(
            (playlistTrack) => playlistTrack.toString() === trackId
          );
          if (foundTrack) {
            addedToPlaylist = true;
          }
        }
      });
    }

    // Check if any action is performed, return false
    if (hasRated || hasLiked || addedToPlaylist) {
      return false;
    }
    else {
      return true;
    }
  } catch (error) {
    console.error('Error checking user activity:', error);
    return false;
  }
}
module.exports.recommendTrackFromTemporal = async (req, res) => {
  try {
      const user = req.user;
      const { username } = user;

      //Get a high rated and non recent activity artist
      const topRatedArtist = await getRecentRatedArtist(username);
      if (!topRatedArtist) {
          return res.status(404).json({ message: 'No liked songs before 7 days or no rated artists.' });
      }

      //Get a random track from given artist
      const randomTrack = await getRandomTrackFromArtist(topRatedArtist);
      if (!randomTrack) {
          return res.status(500).json({ message: 'Error getting random track.' });
      }

      //Get the artist name
      const artist=await Artist.findById(topRatedArtist);
      const artistName=artist.name;

      return res.status(200).json({ 
        randomTrack,
        artistName
       });
  } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json({ message: 'Internal server error.' });
  }
};

async function getRecentRatedArtist(username) {
  try {
      // Fetch the user's ratings from the database
      const userRatings = await UserToRatings.findOne({ username }).exec();

      // Get all artist ratings
      const artistRatings = userRatings.artistRatings || [];

      //Get all liked content
      const likedContent=await LikedContent.findOne({ username }).exec();


      // Filter tracks that were liked in last 7 days
      const recentLikedTracks = likedContent.likedTracks.filter((track) => {
          const last7Days = new Date();
          last7Days.setDate(last7Days.getDate() - 7);
          return new Date(track.likedAt) >= last7Days;
      });
      const recentTracksIds=recentLikedTracks.map((likedTrack)=>likedTrack.track);

      //Get tracks that liked in last 7 days
      const recentTracks = await Promise.all(recentTracksIds.map((trackId) => Track.findById(trackId)));;

      //Get artists of those tracks
      const recentArtistsIds3= (recentTracks.map ((track)=>track.artists));

      const recentArtistsIds2= recentArtistsIds3.flat();
      const recentArtistsIds1= recentArtistsIds2.map((artistId)=>artistId.toString())

      const recentArtistsIds = [...new Set(recentArtistsIds1)];


      // Get artists rated higher than 7
      const highRatedArtists = artistRatings.filter(artist=>artist.rating > 7.0).map(artist=>artist.artist);

      //Get both high rated non recent activity artists
      const crossedArtists = recentArtistsIds.filter(element => highRatedArtists.includes(element));

      // Choose one artist randomly from the high rated artists array
      const randomIndex = Math.floor(Math.random() * crossedArtists.length);
      const randomArtist = crossedArtists[randomIndex];


      return randomArtist;
  } catch (error) {
    console.error(`Error: ${error.message}`);
      throw error;
  }
}

async function getRandomTrackFromArtist(artistId) {
  try {
      // Find the artist by Id
      const artist = await Artist.findById(artistId).exec();

      // Get random album Id from the artist
      const randomAlbumId =artist.albums[Math.floor(Math.random() * artist.albums.length)];

      // Get randomAlbum by its Id
      const randomAlbum= await Album.findById(randomAlbumId).exec();

      // Get a random track Id from the album
      const randomTrackId = randomAlbum.tracks[Math.floor(Math.random() * randomAlbum.tracks.length)];

      // Get randomTrack by its Id
      const randomTrack=await Track.findById(randomTrackId).exec();

      // Return the selected random track
      return randomTrack;
  } catch (error) {
      console.error(`Error: ${error.message}`);
      throw error;
  }
}