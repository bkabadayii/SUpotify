const {
    recommendTrackFromFollowedUser,
    recommendTrackFromUserRatings,
    recommendTrackFromTemporal,
} = require("../controllers/recommendationController");

const router = require("express").Router();

router.get("/recommendTrackFromFollowedUser/:trackNum",recommendTrackFromFollowedUser);
router.get("/recommendTrackFromUserRatings",recommendTrackFromUserRatings);
router.get("/recommendTrackFromTemporal",recommendTrackFromTemporal);


module.exports = router;