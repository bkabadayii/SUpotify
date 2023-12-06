const { addNewAlbum, addNewArtist } = require("../operations/addContent");
const { getTrack, getAlbum, getArtist } = require("../operations/getContent");

const router = require("express").Router();

router.post("/addNewAlbum", addNewAlbum);
router.post("/addNewArtist", addNewArtist);

router.get("/getTrack/:trackID", getTrack);
router.get("/getAlbum/:albumID", getAlbum);
router.get("/getArtist/:artistID", getArtist);

module.exports = router;
