const { addNewArtist } = require("../controllers/artistController");

const router = require("express").Router();

router.post("/addNewArtist", addNewArtist);

module.exports = router;
