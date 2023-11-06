const {
    createLikedSongsForUser,
} = require("../controllers/likedSongsController");
const router = require("express").Router();

router.post("/createLikedSongsForUser", createLikedSongsForUser);

module.exports = router;
