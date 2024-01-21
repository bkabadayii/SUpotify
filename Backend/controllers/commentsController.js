const Track = require("../models/trackModel");
const Album = require("../models/albumModel");
const Artist = require("../models/artistModel");
const Comment = require("../models/commentModel");
const ContentToComments = require("../models/contentToCommentsModel");

// Gets all comments for a content
/*
    params: {
        contentType: String,
        relatedID: ObjectID
    }    
*/
module.exports.getContentComments = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        const { contentType, relatedID } = req.params;

        // Get the content comments, if it does not exist, initialize it
        let existingContentToComments = await ContentToComments.findOne({
            contentType,
            relatedID,
        });
        // If it does not exist, initialize it
        if (!existingContentToComments) {
            // Check if contentType is valid
            let existingContent;
            if (contentType === "TRACK") {
                existingContent = await Track.findById(relatedID);
            } else if (contentType === "ALBUM") {
                existingContent = await Album.findById(relatedID);
            } else if (contentType === "ARTIST") {
                existingContent = await Artist.findById(relatedID);
            } else {
                return res.status(500).json({
                    message: "Invalid content type!",
                    success: false,
                });
            }
            // Check if the content exists
            if (!existingContent) {
                return res.status(404).json({
                    message: "Content with the given ID does not exist!",
                    success: false,
                });
            }
            existingContentToComments = await ContentToComments.create({
                contentType,
                relatedID,
                comments: [],
            });
        }

        // Populate the comments
        const populatedContentToComments =
            await existingContentToComments.populate("comments");

        // Mark the comments that the user liked
        const allComments = populatedContentToComments.comments.map(
            (comment) => {
                let selfLike = comment.likes.find(
                    (likeUsername) => likeUsername === username
                );
                if (selfLike) {
                    selfLike = true;
                } else {
                    selfLike = false;
                }
                return {
                    _id: comment._id,
                    username: comment.username,
                    commentContent: comment.commentContent,
                    commentedAt: comment.commentedAt,
                    totalLikes: comment.likes.length,
                    selfLike,
                };
            }
        );

        res.status(201).json({
            message: "Returned content comments successfully",
            success: true,
            allComments,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Get Content Comments Failed!" });
    }
};

// Adds a new comment for a given user, commentType, and relatedID,
// commentType is "TRACK" or "ALBUM" or "ARTIST"
// relatedID is the id of the track / album / artist
/*
    body: {
        contentType: String,
        relatedID: ObjectID,
        comment: String
    }
*/
module.exports.commentContent = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        const { contentType, relatedID, comment } = req.body;

        // Get the content comments, if it does not exist, initialize it
        let existingContentToComments = await ContentToComments.findOne({
            contentType,
            relatedID,
        });
        // If it does not exist, initialize it
        if (!existingContentToComments) {
            // Check if contentType is valid
            let existingContent;
            if (contentType === "TRACK") {
                existingContent = await Track.findById(relatedID);
            } else if (contentType === "ALBUM") {
                existingContent = await Album.findById(relatedID);
            } else if (contentType === "ARTIST") {
                existingContent = await Artist.findById(relatedID);
            } else {
                return res.status(500).json({
                    message: "Invalid content type!",
                    success: false,
                });
            }
            // Check if the content exists
            if (!existingContent) {
                return res.status(404).json({
                    message: "Content with the given ID does not exist!",
                    success: false,
                });
            }
            existingContentToComments = await ContentToComments.create({
                contentType,
                relatedID,
                comments: [],
            });
        }

        // Create a new comment
        const newComment = await Comment.create({
            username,
            commentContent: comment,
            commentedAt: new Date(),
            likes: [],
        });
        // Add the new comment to existing content to comments
        existingContentToComments.comments.push(newComment);
        // Save database
        await existingContentToComments.save();

        res.status(201).json({
            message: "Commented to content successfully",
            success: true,
            newComment,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Comment Content Failed!" });
    }
};

// Deletes a comment if it belongs to the user
/*
    body: {
        commentID: ObjectID
        contentType: String,
        relatedID: ObjectID
    }
*/
module.exports.deleteComment = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        const { commentID, contentType, relatedID } = req.body;

        // Get the comment
        let existingComment = await Comment.findById(commentID);
        if (!existingComment) {
            return res.status(404).json({
                message: "Comment with the given ID does not exist!",
                success: false,
            });
        }
        // Check if the comment belongs to the user
        if (existingComment.username != username) {
            return res.status(500).json({
                message:
                    "Cannot delete comments which does not belong to the user!",
                success: false,
            });
        }

        // Check the content comments' existstance
        let existingContentToComments = await ContentToComments.findOne({
            contentType,
            relatedID,
        });
        if (!existingContentToComments) {
            return res.status(404).json({
                message: "Content to comments does not exist!",
                success: false,
            });
        }

        // Delete comment from content to comments' comments list
        await ContentToComments.findOneAndUpdate(
            { contentType, relatedID },
            { $pull: { comments: commentID } },
            { new: true }
        );

        await Comment.findByIdAndDelete(commentID);

        res.status(201).json({
            message: "Deleted comment successfully",
            success: true,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Delete Comment Failed!" });
    }
};

// Likes a comment if it is not liked, unlikes if it is liked
/*
    body: {
        commentID: ObjectID
    }
*/
module.exports.switchCommentLikeStatus = async (req, res) => {
    try {
        // Get user information from the information coming from verifyToken middleware
        const user = req.user;
        const { username } = user;

        const { commentID } = req.body;

        // Get the comment
        let existingComment = await Comment.findById(commentID);
        if (!existingComment) {
            return res.status(404).json({
                message: "Comment with the given ID does not exist!",
                success: false,
            });
        }

        // Check if the user liked the comment
        const index = existingComment.likes.indexOf(username);
        let newLikeStatus;
        // If the user liked the comment, unlike
        if (index > -1) {
            existingComment.likes.splice(index, 1);
            newLikeStatus = false;
        }
        // Else, like the comment
        else {
            existingComment.likes.push(username);
            newLikeStatus = true;
        }

        // Save database
        await existingComment.save();

        res.status(201).json({
            message: "Switched comment like status successfully",
            success: true,
            newLikeStatus,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Switch Comment Like Status Failed!" });
    }
};
