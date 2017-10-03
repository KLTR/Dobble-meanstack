/**
 * Created by rLevy on 7/13/2017.
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const fs = require('fs');
const multer = require('multer');
var firebase = require("firebase");
// models
const Contact = require('../models/contacts');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

// date
const dateTime = require('node-datetime');



router.get('/get_avatar/:username', function(req, res) {
    res.json({ path: 'http://localhost:3000/uploads/' + req.params.username + '-avatar.jpg' });
});

router.post('/setProfilePic', function(req, res, next) {

});



//user login and registration 

// Register
router.post('/register', (function(req, res, next) {
    let newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        avatar: "http://enadcity.org/enadcity/wp-content/uploads/2017/02/profile-pictures.png"
    });

    User.addUser(newUser, function(err, user) {
        if (err) {
            res.json({ success: false, msg: 'Failed to register user' });
        } else {
            res.json({ success: true, msg: 'user was registered' });
        }
    });
}));


// get all members
router.get('/allUsers/:username', function(req, res, next) {
    var username = req.params.username;
    User.getAllUsers(username, function(err, users) {
        if (err) {
            res.json({ success: false, msg: 'Failed to get users' });
        } else {
            return res.json({ success: true, users: users })
        }
    })
});


router.post('/updateAvatar', (function(req, res, next) {

        const username = req.body.username;
        const url = req.body.avatar;

        User.updateAvatar(username, url, function(err, doc) {
            if (err) {
                throw err;
            }
            if (!doc) {
                res.json({ success: false, msg: 'file not found' });
            }
        });
        res.json({ success: true, msg: 'url: ' + req.body.avatar })
    }

));

// Authentication
router.post('/authenticate', (function(req, res, next) {
    // user inserts username and password
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) {
                throw err;
            }
            if (isMatch) {
                const token = jwt.sign(user, config.secret, {
                        expiresIn: 604800
                    } //1 week
                );
                if (user.avatar) {
                    var avatar = user.avatar;
                } else {
                    var avatar = "http://enadcity.org/enadcity/wp-content/uploads/2017/02/profile-pictures.png";
                }
                return res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        username: user.username,
                        email: user.email,
                        avatar: avatar
                    }
                });
            } else {
                return res.json({ success: false, msg: 'Wrong password' });
            }
        });
    });
}));

router.post('/addThought', function(req, res, next) {
    let newThought = ({
        author: req.body.author,
        content: req.body.content,
        img: req.body.img
    })
    console.log(req.body);
    User.addThought(newThought, function(err, thought) {
        if (err) {
            res.json({ success: false, msg: 'Failed to add thought (user model)' });
        } else {
            res.json({ success: true, msg: 'thought was saved !' });
        }
    })
})

router.post('/addPost', function(req, res, next) {
    var dt = dateTime.create();
    var formatted = dt.format('d/m/Y H:M:S');
    let newPost = new Post({
        author: req.body.author,
        content: req.body.content,
        userImg: req.body.avatar,
        date: formatted
    });
    Post.addPost(newPost, function(err, post) {
        if (err) {
            return err
        } else {
            User.addPost(newPost, function(err, post) {
                if (err) {
                    res.json({ success: false, msg: 'Failed to add post (user model)' });
                } else {
                    res.json({ success: true, msg: 'post was added to the user model posts[]' });
                }
            })
        }
    })
})
router.post('/addComment/:id', function(req, res, next) {
    var id = req.params.id;
    var dt = dateTime.create();
    var formatted = dt.format('d/m/Y H:M:S');
    let newComment = ({
        author: req.body.author,
        content: req.body.commentContent,
        userImg: req.body.avatar,
        date: formatted
    });
    console.log('comment was created !')
    Post.addComment(newComment, id, function(err, comment) {
        if (err) {
            res.json({ success: false, msg: 'Failed to add comment ' });
        } else {
            res.json({ success: true, msg: 'comment was added ' });
        }
    })
})
router.post('/likePost/:id', function(req, res, next) {
    var id = req.params.id;
    var username = req.body.username;
    Post.likePost(id, username, function(err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json({ success: true, msg: 'post was liked by ' + username });
        }
    });
})

router.get('/friendsPosts/:username', function(req, res, next) {
    var username = req.params.username;
    const user = User.getUserByUsername(username, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }
        Post.getAllFriendsPosts(user, function(err, posts) {
            if (err) {
                throw err;
            }
            if (!posts) {
                return res.json({ success: false, msg: 'no posts found' });
            }
            return res.json({ success: true, posts: posts.reverse() })
        })
    })
})

router.get('/friend/:username', function(req, res, next) {
    var username = req.params.username;
    const user = User.getUserByUsername(username, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }
        return res.json({ success: true, user: user });
    })
})

router.get('/myPosts/:username', function(req, res, next) {
    const username = req.params.username;

    const user = User.getUserByUsername(username, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }
        Post.find({ _id: user.posts }, function(err, posts) {
            if (err) {
                throw err;
            }
            if (!posts) {
                return res.json({ success: false, msg: 'No Posts found' })
            }
            return res.json({ success: true, posts: posts.reverse() })

        })

    })
});

router.delete('/myPosts/:id', function(req, res, next) {
    User.remove({ _id: req.params.id }, function(err, result) {
        if (err) {
            throw err;
        }
        Post.remove({ _id: req.params.id }, function(err, result) {
            if (err) {
                res.json(err);
            } else {
                res.json(result);
            }

        });
    });
});

router.get('/members/:username', function(req, res, next) {
    const username = req.params.username; // to this username we add the friend

    const user = User.getUserByUsername(username, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }
        User.getMembersWithouFriends(user, function(err, members) {
            if (err) {
                return err
            }
            if (!members) {
                return res.json({ success: false, msg: 'no members found !' });
            }
            console.log(members);
            return res.json({ success: true, members: members });

        });
    });

});

router.get('/friendsList/:username', function(req, res, next) {
    const username = req.params.username; // to this username we add the friend
    const user = User.getUserByUsername(username, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }
        User.getFriendsList(user, function(err, friendsList) {
            if (err) {
                return err
            }
            if (!friendsList) {
                return res.json({ success: false, msg: 'no friends found ' });
            }
            return res.json({ success: true, friendsList: friendsList });

        });
    });

});
// Profile
// if we want to protect a route we pass the following line as the SECOND PARAMATER
// passport.authenticate('JWT', {session: false})
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});

// add friend to friends list
router.post('/addFriend/:friendUsername', function(req, res, next) {
    const user = req.body; // to this username we add the friend
    const friendUsername = req.params.friendUsername;
    User.addFriend(user, friendUsername, function(err, flag) {
        if (err) {
            throw (err);
        }
        if (!flag) {
            res.json({ success: false, msg: 'Friend is already on friends list' });
        }
    });
    res.json({ success: true, msg: 'user was added to friends list' });

});

router.get

module.exports = router;

//retrieving data
// router.get('/contacts', function(req, res, next) {
//     Contact.find(function(err, contacts) {
//         res.json(contacts);
//     })
// });

// //add contact
// router.post('/contacts', function(req, res, next) {
//     var newContact = new Contact({
//         first_name: req.body.first_name,
//         last_name: req.body.last_name,
//         phone: req.body.phone
//     });

//     newContact.save(function(err, contact) {
//         if (err) {
//             res.json({ msg: 'Failed to add contact' })
//         } else {
//             res.json({ msg: 'Contact added successfully' })
//         }
//     })
// });

// //deleting contacts
// router.delete('/contacts/:id', function(req, res, next) {
//     Contact.remove({ _id: req.params.id }, function(err, result) {
//         if (err) {
//             res.json(err);
//         } else {
//             res.json(result);
//         }

//     });
// });


// const multerStorage = multer.diskStorage({
// destination: function(req, file, cb) {
//     cb(null, 'uploads')
// },
//     destination: '../public/uploads',
//     filename: function(req, file, cb) {
//         // this wil automatically delete the old image.
//         cb(null, file.originalname + '-avatar' + '.jpg')

//     }
// });

// const upload = multer({ storage: multerStorage }).single('avatar');
// const upload = multer({ storage: storage }).single();

// router.post('/upload_avatar/', function(req, res) {

//     upload(req, res, function(err) {
//         var username = req.file.originalname;
//         var path = req.file.path;
//         User.addAvatar(username, path, function(err, user) {
//             if (err) {
//                 throw err
//             }
//             if (!user) {
//                 console.log("could not find user");
//             }
//         });
//         if (err) {
//             // An error occurred when uploading
//             throw err;
//         }
//         res.json({
//             sucess: true,
//             message: 'Image was uploaded successfully'
//         });
//         // Everything went fine
//         console.log('file uploaded successfully');
//     })
// });