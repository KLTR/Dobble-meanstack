const mongoose = require('mongoose');
const fs = require('fs');
const User = require('../models/user')
const Comment = require('../models/comment');

const PostSchema = mongoose.Schema({
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
    // comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }]
    comments: [{
        author: String,
        userImg: String,
        content: String,
        date: String,
    }]

});
const Post = module.exports = mongoose.model('Post', PostSchema);


module.exports.addPost = (post, callback) => {
    post.save(callback);
};

module.exports.likePost = (postID, username, callback) => {
    // check if user liked already()

    var update = { $addToSet: { 'likes': username } };
    Post.findByIdAndUpdate(postID, update, { new: true, upsert: true }, callback)
}
module.exports.getAllFriendsPosts = (user, callback) => {
    Post.find({ author: user.friends_list }, callback)

}
module.exports.addComment = (comment, postID, callback) => {
    console.log(postID);
    var update = { $push: { 'comments': comment } };
    Post.findOneAndUpdate({ '_id': postID }, update, { new: true, upsert: true }, callback);
};