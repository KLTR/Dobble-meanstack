// importing modules
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const app = express();
const route = require('./routes/route');
const config = require('./config/database')
const multer = require('multer');

// Watson
var TwitterPackage = require('twitter');
var Twitter2 = require('node-twitter');
var dateTime = require('node-datetime');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const GoogleImages = require('google-images');
const Post = require('../contactlist/models/post');
const User = require('../contactlist/models/user');

//connect to mongodb
mongoose.connect(config.database);

//on connection
mongoose.connection.on('connected', function() {
    console.log("Connected to database mongodb @ 27017")
});


mongoose.connection.on('error', function(err) {
    if (err) {
        console.log('Error in Database connection:' + err)
    }
});

//port no
const port = process.env.PORT || 3000;
//adding middleware - cors
app.use(cors());

//body - parser
app.use(bodyparser.json());

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//static files
app.use(express.static(path.join(__dirname, './public')));
//routes
app.use('/api', route);

//testing
app.get('/', function(req, res) {
    res.send('foobar');
});

//create a cors middleware
app.use(function(req, res, next) {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, 'public/index.html'));
// })

// Watson
var tone_analyzer = new ToneAnalyzerV3({
    username: '68da8502-ac1d-4e36-a1d1-f82d3097e014',
    password: 'd2Vp2xTQaWYn',
    version_date: '2016-05-19'
});

const client = new GoogleImages('005467288581373878283:emd7izdepki', 'AIzaSyCUsAfVjcZN38JxxtBOTk7ie71PP5l1G08')

var secret = {
    consumer_key: '0PbJxxrm1kUfKzGWZqFuwCxEK',
    consumer_secret: 'hGDRFWUZDAeOXcjxjDVaOp3eNiBVodHQFqSw37m3G3xNT3IqKp',
    access_token_key: '325582425-sO3XiWXVAfY0udMDEqaj52e3hMzmMYyeOylVS8TZ',
    access_token_secret: 'mK1lPmll7Bya4mhBiXYoaSg2IVfR1jj7gxzdOSOjNkWE4'
}
var Twitter = new TwitterPackage(secret);

var twitterRestClient = new Twitter2.RestClient(
    '0PbJxxrm1kUfKzGWZqFuwCxEK',
    'hGDRFWUZDAeOXcjxjDVaOp3eNiBVodHQFqSw37m3G3xNT3IqKp',
    '325582425-sO3XiWXVAfY0udMDEqaj52e3hMzmMYyeOylVS8TZ',
    'mK1lPmll7Bya4mhBiXYoaSg2IVfR1jj7gxzdOSOjNkWE4'
);

// <!END>Watson<END>

Twitter.stream('statuses/filter', { track: '#Dobble' }, function(stream) {
    var userImageUrl = 'https://firebasestorage.googleapis.com/v0/b/dobble-e1c3e.appspot.com/o/userImgs%2Freeferblower-avatar.jpg?alt=media&token=27064e4b-dc3a-4c50-99a3-a00f7aa1ba34'
    stream.on('data', function(tweet) {
        console.log("Found ! ");
        var emotion = "";
        var postContent = tweet.user.screen_name + " Just tweeted: " + (tweet.text);
        var params = {
            // Get the text from the JSON file.
            text: tweet.text,
        };

        // Analyze the tone with WTSON
        tone_analyzer.tone(params, function(error, response) {
            if (error) {
                console.log('error:', error);
            }
            console.log(JSON.stringify(response, null, 2));
            var cats = response.document_tone.tone_categories;
            var toneImage = "";
            cats.forEach(function(cat) {
                console.log(cat.category_name);
                cat.tones.forEach(function(tone) {
                    console.log(" %s: %s", tone.tone_name, tone.score)
                    if (tone.score > 0.5 && cat.category_name == "Emotion Tone") {
                        postContent = postContent.concat(" #Emotion: " + tone.tone_name);
                        emotion = tone.tone_name;
                    }

                })
            })

            // Get an image from the tone
            if (emotion == "") {
                postContent = postContent.concat(" --!  Can't recognize the tone  !-- ");
                emotion = "Question Mark";
            }

            console.log(emotion);

            client.search(emotion)
                .then(images => {
                    var picToShow = Math.floor((Math.random() * 9));
                    console.log(picToShow);
                    toneImage = images[picToShow].url;
                    //Building a SQL query to store on DB
                    var dt = dateTime.create();
                    var formatted = dt.format('Y-m-d H:M:S');
                    var emotion = "";
                    let newPost = new Post({
                        author: 'reeferblower',
                        content: postContent,
                        userImg: userImageUrl,
                        postImg: toneImage,
                        date: formatted
                    })
                    Post.addPost(newPost, function(err, post) {
                        if (err) {
                            return err
                        } else {
                            User.addPost(newPost, function(err, post) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('success !');
                                }
                            })
                        }
                    })
                });
        });
    });

    stream.on('error', function(error) {
        console.log(error);
    });
});


app.listen(port, function() {
    console.log('Server started at port :' + port);
});