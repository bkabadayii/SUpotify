const {
    createFollowedUsersForUser,
    addToUserFollowedUsers,
    removeFromUserFollowedUsers,
    getAllFollowedUsersForUser,
} = require("../controllers/followedUsersController");

const router = require("express").Router();

router.get("/getAllFollowedUsersForUser",getAllFollowedUsersForUser);

router.post("/createFollowedUsersForUser", createFollowedUsersForUser);
router.post("/addToUserFollowedUsers", addToUserFollowedUsers);

router.delete("/removeFromUserFollowedUsers", removeFromUserFollowedUsers);

module.exports = router;