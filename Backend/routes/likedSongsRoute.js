const {
    createLikedSongsForUser,
    addToUserLikedSongs,
    addToUserLikedSongsBySpotifyID,
    addCustomToUserLikedSongs,
    addManyToUserLikedSongs,
    removeFromUserLikedSongs,
    getLikedSongsForUser,
} = require("../controllers/likedSongsController");

const router = require("express").Router();

router.post("/createLikedSongsForUser", createLikedSongsForUser);
router.post("/addToUserLikedSongs", addToUserLikedSongs);
router.post("/addToUserLikedSongsBySpotifyID", addToUserLikedSongsBySpotifyID);
router.post("/addManyToUserLikedSongs", addManyToUserLikedSongs);
router.post("/addCustomToUserLikedSongs", addCustomToUserLikedSongs);

router.delete("/removeFromUserLikedSongs", removeFromUserLikedSongs);
router.get("/getLikedSongsForUser", getLikedSongsForUser);

module.exports = router;
