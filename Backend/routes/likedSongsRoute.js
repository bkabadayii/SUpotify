const {
    createLikedSongsForUser,
    addToUserLikedSongs,
    removeFromUserLikedSongs,
} = require("../controllers/likedSongsController");

const router = require("express").Router();

router.post("/createLikedSongsForUser", createLikedSongsForUser);
router.post("/addToUserLikedSongs", addToUserLikedSongs);
router.delete("/removeFromUserLikedSongs", removeFromUserLikedSongs);

module.exports = router;
