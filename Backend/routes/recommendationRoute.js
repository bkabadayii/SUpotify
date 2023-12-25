const {
    recommendTrackFromFollowedUser,
    recommendTrackFromUserRatings,
} = require("../controllers/recommendationController");

const router = require("express").Router();

router.get("/recommendTrackFromFollowedUser/:trackNum",recommendTrackFromFollowedUser);
router.get("/recommendTrackFromUserRatings",recommendTrackFromUserRatings);

module.exports = router;