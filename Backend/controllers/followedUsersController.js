const FollowedUsers = require("../models/followedUsersModel");
const User = require("../models/userModel");

/* ----- INITIALIZER ----- */
module.exports.createFollowedUsersForUser = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        const existingUserFollowedUsers = await FollowedUsers.findOne({
            username,
        });

        if (existingUserFollowedUsers) {
            return res.json({
                message: "Followed users list for this user already exists",
                success: false,
            });
        }

        const userFollowedUsers = await FollowedUsers.create({
            username: username,
            followedUsersList: [],
        });

        res.status(201).json({
            message: "User followed users list is created successfully",
            success: true,
            userFollowedUsers,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
/* ----- INITIALIZER ----- */

/* ----- GENERAL FOLLOWED USERS OPERATIONS ----- */

// In order for a user to add new user to their followedUsersList
// followedUsername is the username of the user that wanted to add in followedUsersList

/*
    body: {
        followedUsername: String
    }
*/

module.exports.addToUserFollowedUsers = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get followedUsername from request body
        const { followedUsername } = req.body;
        let existingUserFollowedUsers = await FollowedUsers.findOne({
            username,
        });

        const checkUsernameExists = async (usernameToCheck) => {
            try {
                const existingUser = await User.findOne({
                    username: usernameToCheck,
                });

                if (existingUser) {
                    return true; //User exists in database
                } else {
                    return false; //User does not exists in database
                }
            } catch (error) {
                console.error("Error occurred while checking username:", error);
                return false;
            }
        };
        const exists = await checkUsernameExists(followedUsername);

        // If given username does not exist in database, throw error
        if (!exists) {
            return res.json({
                message: "This user does not exist!",
                success: false,
            });
        }

        // If given username is same with the users name, throw error
        if (followedUsername == username) {
            return res.json({
                message: "Username cannot be the users username!",
                success: false,
            });
        }

        // If followed users list is not initialized for user, throw error
        if (!existingUserFollowedUsers) {
            return res.json({
                message: "User followed users list does not exist!",
                success: false,
            });
        }

        // If user already followed the other user, throw error
        const duplicate = existingUserFollowedUsers.followedUsersList.find(
            (existingFollowedUsername) =>
                followedUsername === existingFollowedUsername
        );

        if (duplicate) {
            return res.json({
                message:
                    "Followed username already exists in user followed users list!",
                success: false,
            });
        }

        // If there are no errors, add username of followedUser to user's followed users list
        existingUserFollowedUsers.followedUsersList.push(followedUsername);
        await existingUserFollowedUsers.save();

        res.status(201).json({
            message: `Added followed username: ${followedUsername}, to followed users list of user: ${username}`,
            success: true,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
};

// In order for a user to remove a user from their followedUsersList
// followedUsername is the username of the user that wanted to remove from followedUsersList

/*
    body: {
        followedUsername: String
    }
*/
module.exports.removeFromUserFollowedUsers = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get followedUsername from request body
        const { followedUsername } = req.body;
        let existingUserFollowedUsers = await FollowedUsers.findOne({
            username,
        });

        // If followed users list is not initialized for user, throw error
        if (!existingUserFollowedUsers) {
            return res.json({
                message: "User followed users list does not exist!",
                success: false,
            });
        }

        // If user have not followed the user, throw error
        const existingFollowedUsername =
            existingUserFollowedUsers.followedUsersList.find(
                (existingFollowedUsername) =>
                    followedUsername === String(existingFollowedUsername)
            );

        if (!existingFollowedUsername) {
            return res.status(404).json({
                message:
                    "Cannot remove from followed users because user has not followed the user!",
                success: false,
            });
        }

        // If there are no errors, remove the user from followed users list
        const updatedFollowedUsers = await FollowedUsers.findOneAndUpdate(
            { username: username },
            { $pull: { followedUsersList: followedUsername } }, // Pulling item from the followed users list
            { new: true }
        );

        res.status(200).json({
            message: "User is removed from followed users successfully",
            updatedFollowedUsers,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// In order for a user to get their followed users 
module.exports.getAllFollowedUsersForUser = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Find the user's followed users list
        const existingUserFollowedUsers = await FollowedUsers.findOne({
            username,
        });

        // Check if the Followed Users List is initialized or not
        if (!existingUserFollowedUsers) {
            return res.json({
                message: "User followed users list does not exist!",
                success: false,
            });
        }

        const followedUsers = existingUserFollowedUsers.followedUsersList;

        res.status(200).json({
            message: "Retrieved followed users successfully",
            success: true,
            followedUsers,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};
/* ----- GENERAL FOLLOWED USERS OPERATIONS ----- */

/* -------- HELPER FUNCTIONS -------- */

// Checks if the two users follow each other 
module.exports.isFriend = async (user1, user2) => {
    const checkUsernameExists = async (usernameToCheck) => {
        try {
            const existingUser = await User.findOne({
                username: usernameToCheck,
            });

            if (existingUser) {
                return true; //User exists in database
            } else {
                return false; //User does not exists in database
            }
        } catch (error) {
            console.error("Error occurred while checking username:", error);
            return false;
        }
    };

    try {
        const exists1 = await checkUsernameExists(user1);
        const exists2 = await checkUsernameExists(user2);

        if (!exists1 || !exists2) {
            return {
                message: "One of the users does not exist!",
                success: false,
            };
        }

        // Check if user1 follows user2
        const user1FollowsUser2 = await FollowedUsers.findOne({
            username: user1,
            followedUsersList: user2,
        }).lean();

        // Check if user2 follows user1
        const user2FollowsUser1 = await FollowedUsers.findOne({
            username: user2,
            followedUsersList: user1,
        }).lean();

        const followsData = {
            user1FollowsUser2: !!user1FollowsUser2,
            user2FollowsUser1: !!user2FollowsUser1,
            followsEachOther: !!user1FollowsUser2 && !!user2FollowsUser1,
        };

        return followsData;
    } catch (error) {
        throw error;
    }
};
/* -------- HELPER FUNCTIONS -------- */

/* ----- GENERAL BLOCK OPERATIONS ----- */

// In order for a user to recommendationBlock a user
// blockedUsername is the username of the user that wanted to block from getting recommendation

/*
    body: {
        blockedUsername: String
    }
*/

module.exports.recommendationBlockUser = async (req,res)=>{
  try{
    // Get user information from the information coming from verifyToken middleware
    const user = req.user;
    const { username } = user;

    // Get blocked username from request body
    const {blockedUsername} = req.body;

    const existingUserBlockedUsers = await FollowedUsers.findOne({
        username,
    });

    const checkUsernameExists = async (usernameToCheck) => {
        try {
            const existingUser = await User.findOne({
                username: usernameToCheck,
            });

            if (existingUser) {
                return true; //User exists in database
            } else {
                return false; //User does not exists in database
            }
        } catch (error) {
            console.error("Error occurred while checking username:", error);
            return false;
        }
    };
    const exists = await checkUsernameExists(blockedUsername);

    // If given username does not exist in database, throw error
    if (!exists) {
        return res.json({
            message: "This user does not exist!",
            success: false,
        });
    }

    // If given username is same with the users name, throw error
    if (blockedUsername == username) {
        return res.json({
            message: "Username cannot be the users username!",
            success: false,
        });
    }

    // Check if the Blocked Users List is initialized or not
    if (!existingUserBlockedUsers) {
        return res.json({
            message: "User blocked users list does not exist!",
            success: false,
        });
    }

    // If user already blocked the other user, throw error
    const duplicate = existingUserBlockedUsers.recommendationBlockedUsersList.find(
        (existingBlockedUsername) =>
            blockedUsername === existingBlockedUsername
    );

    if (duplicate) {
        return res.json({
            message:
                "Blocked username already exists in user blocked users list!",
            success: false,
        });
    }

    // If there are no errors, add username of blockedUser to user's recommendationBlocked users list
    existingUserBlockedUsers.recommendationBlockedUsersList.push(blockedUsername);
    await existingUserBlockedUsers.save();

    res.status(201).json({
        message: `This username: ${blockedUsername}, will not get any recommendations from user: ${username}`,
        success: true,
    });

  }  catch(err){
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// In order for a user to recommendationUnblock a user
// blockedUsername is the username of the user that wanted to unblock from getting recommendation

/*
    body: {
        blockedUsername: String
    }
*/
module.exports.recommendationUnblockUser = async (req,res)=>{
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        // Get blockedUsername from request body
        const { blockedUsername } = req.body;
        let existingUserBlockedUsers = await FollowedUsers.findOne({
            username,
        });

        // If blocked users list is not initialized for user, throw error
        if (!existingUserBlockedUsers) {
            return res.json({
                message: "User blocked users list does not exist!",
                success: false,
            });
        }

        // If user have not blocked the user, throw error
        const existingBlockedUsername =
            existingUserBlockedUsers.recommendationBlockedUsersList.find(
                (existingBlockedUsername) =>
                    blockedUsername === String(existingBlockedUsername)
            );
    
        if (!existingBlockedUsername) {
            return res.status(404).json({
                message:
                    "Cannot unblock this user because user has not blocked the wanted user!",
                success: false,
            });
        }

        // If there are no errors, remove the user from blocked users list
        const updatedBlockedUsers = await FollowedUsers.findOneAndUpdate(
            { username: username },
            { $pull: { recommendationBlockedUsersList: blockedUsername } }, // Pulling item from the blocked users list
            { new: true }
        );

        res.status(200).json({
            message: "User unblocked successfully",
            updatedBlockedUsers,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};
/* ----- GENERAL BLOCK OPERATIONS ----- */