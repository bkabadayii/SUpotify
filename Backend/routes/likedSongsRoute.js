const {
    createLikedSongsForUser,
    addToUserLikedSongs,
    removeFromUserLikedSongs,
    getLikedSongsForUser,
} = require("../controllers/likedSongsController");

const router = require("express").Router();

router.post("/createLikedSongsForUser", createLikedSongsForUser);
router.post("/addToUserLikedSongs", addToUserLikedSongs);
router.delete("/removeFromUserLikedSongs", removeFromUserLikedSongs);
router.get("/getLikedSongsForUser", getLikedSongsForUser);

module.exports = router;
