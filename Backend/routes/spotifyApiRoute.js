const { getTrackFromSpotify,
        getAlbumFromSpotify,
        getArtistFromSpotify
} = require("../controllers/spotifyApiController");
const router = require("express").Router();

router.get("/getTrackData", getTrackFromSpotify);
router.get("/getAlbumData", getAlbumFromSpotify);
router.get("/getArtistData", getArtistFromSpotify);

module.exports = router;