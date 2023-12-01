const {
    createPlaylist,
    createUserToPlaylists,
    getUserPlaylists,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    getPlaylist,
} = require("../controllers/playlistController");

const router = require("express").Router();

router.post("/createUserToPlaylists", createUserToPlaylists);
router.get("/getUserPlaylists", getUserPlaylists);

router.post("/createPlaylist", createPlaylist);
router.delete("/deletePlaylist", deletePlaylist);
router.get("/getPlaylist/:playlistID", getPlaylist);

router.post("/addTrackToPlaylist", addTrackToPlaylist);
router.delete("/removeTrackFromPlaylist", removeTrackFromPlaylist);

module.exports = router;
