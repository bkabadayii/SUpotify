const {
    createLikedSongsForUser,
    addToUserLikedSongs,
    addManyToUserLikedSongs,
    removeFromUserLikedSongs,
    getLikedSongsForUser,
} = require("../controllers/likedSongsController");

const router = require("express").Router();

router.post("/createLikedSongsForUser", createLikedSongsForUser);
router.post("/addToUserLikedSongs", addToUserLikedSongs);
router.post("/addManyToUserLikedSongs", addManyToUserLikedSongs);

router.delete("/removeFromUserLikedSongs", removeFromUserLikedSongs);
router.get("/getLikedSongsForUser", getLikedSongsForUser);

module.exports = router;
