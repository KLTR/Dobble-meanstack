const mongoose = require('mongoose');
const fs = require('fs');
const User = require('../models/user')
const CommentSchema = mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true,
        // index: { unique: true, dropDups: true }
    },
    // array of usernames
    likes: [String],
    userImg: {
        type: String
    },

});
const Comment = module.exports = mongoose.model('Comment', CommentSchema);


module.exports.addComment = (comment, callback) => {
    comment.save(callback);
};

module.exports.likeComment = (commentID, username, callback) => {
        // check if user liked already()

        var update = { $addToSet: { 'likes': username } };
        Comment.findByIdAndUpdate(commentID, update, { new: true, upsert: true }, callback)
    }
    // module.exports.getAllFriendsPosts = (user, callback) => {
    //     Comment.find({ author: user.friends_list }, callback)

// }