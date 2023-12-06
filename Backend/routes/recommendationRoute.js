const {
    recommendTrackFromFollowedUser,
} = require("../controllers/recommendationController");

const router = require("express").Router();

router.get("/recommendTrackFromFollowedUser/:trackNum",recommendTrackFromFollowedUser);
module.exports = router;