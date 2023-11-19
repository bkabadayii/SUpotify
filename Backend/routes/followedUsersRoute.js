const {
    createFollowedUsersForUser,
    addToUserFollowedUsers,
    removeFromUserFollowedUsers,
} = require("../controllers/followedUsersController");

const router = require("express").Router();

router.post("/createFollowedUsersForUser", createFollowedUsersForUser);
router.post("/addToUserFollowedUsers", addToUserFollowedUsers);

router.delete("/removeFromUserFollowedUsers", removeFromUserFollowedUsers);

module.exports = router;