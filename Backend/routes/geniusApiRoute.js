const { getLyricsOfASong } = require("../controllers/geniusApiController");
const router = require("express").Router();

router.get("/getLyricsOfASong/:songName/:artistName", getLyricsOfASong);

module.exports = router;