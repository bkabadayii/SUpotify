const {
    createPlaylist,
    createUserToPlaylists,
    getUserPlaylists,
} = require("../controllers/playlistController");

const router = require("express").Router();

router.post("/createUserToPlaylists", createUserToPlaylists);
router.get("/getUserPlaylists", getUserPlaylists);

router.post("/createPlaylist", createPlaylist);

module.exports = router;
