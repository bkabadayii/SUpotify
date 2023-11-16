const {
    createLikedSongsForUser,
    addToUserLikedSongs,
    addToUserLikedSongsBySpotifyID,
    addManyToUserLikedSongs,
    removeFromUserLikedSongs,
    getLikedSongsForUser,
} = require("../controllers/likedSongsController");

const router = require("express").Router();

router.post("/createLikedSongsForUser", createLikedSongsForUser);
router.post("/addToUserLikedSongs", addToUserLikedSongs);
router.post("/addToUserLikedSongsBySpotifyID", addToUserLikedSongsBySpotifyID);
router.post("/addManyToUserLikedSongs", addManyToUserLikedSongs);

router.delete("/removeFromUserLikedSongs", removeFromUserLikedSongs);
router.get("/getLikedSongsForUser", getLikedSongsForUser);

module.exports = router;
