const {
    createLikedContent,
    getLikedContent,
    likeContent,
    likeTrackBySpotifyID,
    likeCustomTrack,
    addManyToLikedTracks,
    removeFromLikedContent,
} = require("../controllers/likedContentController");

const router = require("express").Router();

router.post("/createLikedContent", createLikedContent);
router.get("/getLikedContent/:contentType", getLikedContent);

// router.post("/likeContent", likeContent);
router.delete("/removeFromLikedContent", removeFromLikedContent);

router.post("/likeTrackBySpotifyID", likeTrackBySpotifyID);
router.post("/likeCustomTrack", likeCustomTrack);

router.post("/addManyToLikedTracks", addManyToLikedTracks);

module.exports = router;
