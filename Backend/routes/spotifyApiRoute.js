const { searchFromSpotify } = require("../controllers/spotifyApiController");
const router = require("express").Router();

router.get("/search/:searchTerm", searchFromSpotify);

module.exports = router;
