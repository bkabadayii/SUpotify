const {
    createLikedContent,
    getLikedContent,
    likeContent,
    removeFromLikedContent,
    likeTrackBySpotifyID,
    likeCustomTrack,
    addManyToLikedTracks,
    likeAlbumBySpotifyID,
    likeArtistBySpotifyID,
    addTracksByMongoURL,
} = require("../controllers/likedContentController");

const router = require("express").Router();

router.post("/createLikedContent", createLikedContent);
router.get("/getLikedContent/:contentType", getLikedContent);
router.post("/likeContent", likeContent);
router.delete("/removeFromLikedContent", removeFromLikedContent);

router.post("/likeTrackBySpotifyID", likeTrackBySpotifyID);
router.post("/likeCustomTrack", likeCustomTrack);
router.post("/addManyToLikedTracks", addManyToLikedTracks);
router.post("/addTracksByMongoURL", addTracksByMongoURL);

router.post("/likeAlbumBySpotifyID", likeAlbumBySpotifyID);

router.post("/likeArtistBySpotifyID", likeArtistBySpotifyID);

module.exports = router;
