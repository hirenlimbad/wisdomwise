const express = require('express');
const mongoose = require('./connection');
const sharp = require('sharp');

const cors = require('cors');
const QuoteModel = require('.//models//Quote.js');
const UserModel = require('.//models//User.js');
const FollowModel = require('.//models//Follow.js');
const LikeModel = require('.//models//Like.js');
const BookmarkModel = require('.//models//Bookmark.js');
const seenQuote = require('.//models//SeenQuotes.js');
const CopyModel = require('.//models//Copy.js');
const ShareModel = require('.//models//Share.js');
const TagsModel = require('.//models//Tags.js');
const ThoughtModel = require('.//models//Thoughts.js');
const ThoughtLikeModel = require('.//models//ThoughtLike.js');

const ContentBasedFiltering = require('./RecommendationEngine/ContentBasedFiltering.js');




// chekcing mongo connection



const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const { setUser, getUser } = require("./auth.js");

const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');

var passwordGenerator = require('generate-password');




const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'https://wisesays.vercel.app',
    credentials: true
}));

const cookieParser = require('cookie-parser');
const Share = require('./models/Share.js');
app.use(cookieParser());


// middleware to check if user is logged in
async function checkLoggedIn(req, res, next) {
    const sessionId = req.cookies.sessionid;
    const user = await getUser(sessionId);
    if (user) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}


// User registration
app.post('/register', async (req, res) => {
    UserModel.create(req.body)
        .then(users => res.json(users))
        .catch(err => {
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'An error occurred while creating the user.' });
        });
});

// User login
app.post('/login', async (req, res) => {
    try {
        console.log("email verify")
        const users = await UserModel.findOne({ uemail: req.body.uemail, upassword: req.body.upassword });
        const user_id = await UserModel.findOne({ useridpub: req.body.uemail, upassword: req.body.upassword });
        if (users) {
            console.log("email login")
            const sessionid = uuidv4();
            setUser(sessionid, users);
            res.cookie('sessionid', sessionid,
                {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
                }
            );
            res.status(200).json({ message: 'Success' });
        }

        if (user_id) {
            console.log("user_id login")
            const sessionid = uuidv4();
            setUser(sessionid, user_id);
            res.cookie('sessionid', sessionid, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
            });
            res.status(200).json({ message: 'Success' });
        }
        else {
            res.status(400).json({ error: 'Invalid credentials' });
        }

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' + err });
    }
});

app.get('/getUserName', async (req, res) => {
    const sessionId = req.cookies.sessionid;
    const userid = await getUser(sessionId);

    if (userid) {
        const user = await UserModel.findOne ({_id: userid}); 
        res.json({ name: user.uname, useridpub: user.useridpub, profileImage: user.profileImage, tagline: user.tagline});
    } else {
        res.json({ name: "Please Log in" });
    }
});

const getProfileImage = async (username) => {
    const user = await UserModel.findOne({ useridpub: username });
    if (user) {
        const base64Image = user.profileImage.split(';base64,').pop();
        const imageBuffer = Buffer.from(base64Image, 'base64');

        // Resize and process the image
        const resizedBuffer = await sharp(imageBuffer)
            .resize(200, 200) // Resize to 200x200 pixels
            .jpeg({ quality: 80 }) // Compress using JPEG format with 80% quality
            .toBuffer();

        const resizedImage = resizedBuffer.toString('base64');
        return resizedImage;
    } else {
        throw new Error('User not found');
    }
};

app.post("/getProfileImage", async (req, res) => {
    const username = req.body.params.userid;

    try {
        const user = await UserModel.findOne({ useridpub: username });
        if (user) {
            const base64Image = user.profileImage.split(';base64,').pop();
            const imageBuffer = Buffer.from(base64Image, 'base64');

            // Validate if the buffer is a supported image format
            try {
                const resizedBuffer = await sharp(imageBuffer)
                    .resize(200, 200) // Resize to 200x200 pixels
                    .jpeg({ quality: 80 }) // Compress using JPEG format with 80% quality
                    .toBuffer();

                const resizedImage = resizedBuffer.toString('base64');

                res.json({ profileImage: resizedImage });
            } catch (imageProcessingError) {
                console.error('Error processing image:', imageProcessingError);
                res.status(500).json({ error: 'Error processing image' });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});


app.get("/getUserDetails", async (req, res) => {
    const sessionId = req.cookies.sessionid;
    console.log("session id is: " + sessionId);
    const user = await getUser(sessionId);
    if (user) {
        const userDetails = await UserModel .findOne({ _id: user });
        res.json(userDetails);
    } else {
        console.log("User not found");
        res.status(401).json({ error: 'Unauthorized' });
    }
});

app.post("/getProfileImage", (req, res) => {
    const username = req.body.params.userid;
    UserModel.findOne({ useridpub: username })
        .then(user => {
            if (user) {
                res.json({ profileImage: user.profileImage });
            }
            else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch(
            err => res.json(err));
});

// follow
app.post('/follow', async (req, res) => {
    let toFollow = req.body.username;
    let sessionId = req.cookies.sessionid;
    let user = await getUser(sessionId);

    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    let follower = user._id;
    let following = await UserModel.findOne({ useridpub: toFollow });
    following = following._id;
    FollowModel.findOne({ follower: follower, following: following })
        .then(follow => {
            if (follow) {
                FollowModel.findByIdAndDelete(follow._id)
                    .then(() => res.json({ message: "Unfollowed" }))
                    .catch(err => res.json(err));
            } else {
                FollowModel.create({ follower: follower, following: following })
                    .then(() => res.json({ message: "Followed" }))
                    .catch(err => res.json(err));
            }
        }
        )
        .catch(err => res.json(err));
}
);

// checkFollow
app.post('/checkFollow', async (req, res) => {
    let toFollow = req.body.username;
    let sessionId = req.cookies.sessionid;
    let user = await getUser(sessionId);

    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    let follower = user._id;
    let following = await UserModel.findOne({ useridpub: toFollow });

    if (!following) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    FollowModel.findOne({ follower: follower, following: following._id })
        .then(follow => {
            if (follow) {
                res.json({ isFollowing: true });
            } else {
                res.json({ isFollowing: false });
            }
        })
        .catch(err => res.json(err));
}
);

app.post('/getFollowedPosts', async (req, res) => {
    let sessionId = req.cookies.sessionid;
    let user = await getUser(sessionId);
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    let follower = user._id;
    const CBF = new ContentBasedFiltering();
    await CBF.setUser(follower);
    let recommended = await CBF.getFollowingRecommendation(15);
    res.json(recommended);
}
);


let storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + " " + file.originalname)
    }

})

const path = require('path');
const Quote = require('.//models//Quote.js');

let user = {
    uname: 'JohnDoe',
    uemail: 'john@example.com',
    tagline: 'Life is beautiful',
    about: 'Lorem ipsum...',
    profileImage: ''
};

const upload = multer({ storage });


app.post('/updateUser', upload.single('profileImage'), async (req, res) => {
    try {
        let userId = await getUser(req.cookies.sessionid);
        let user = {
            uname: req.body.uname,
            uemail: req.body.uemail,
            tagline: req.body.tagline,
            useridpub: req.body.useridpub,
            about: req.body.about,
            profileImage: req.file ? req.file.path : req.body.profileImage  // Adjusted to handle file upload correctly
        };



        const updatedUser = await UserModel.findByIdAndUpdate(userId, user, { new: true, runValidators: true });

        if (updatedUser) {
            res.json({ "message": "User updated successfully", user: updatedUser });
        } else {
            res.status(500).json({ error: 'An error occurred while updating the user.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});






// User logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to logout' });
        } else {
            res.json({ message: 'Logout successful' });
        }
    });
});




app.get('/getQuotes', async (req, res) => {
    const sessionId = req.cookies.sessionid;
    const user = await getUser(sessionId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    if (user) {
        try {
            const CBF = new ContentBasedFiltering();
            console.log("user is : " + user._id);
            await CBF.setUser(user._id);
            let recommended = await CBF.recommend(5);

            // Use map to create an array of promises for fetching quotes
            let quotePromises = recommended.map(async (quote) => {
                return await QuoteModel.findById(quote);
            });

            // Wait for all quote fetching promises to resolve
            let quotes = await Promise.all(quotePromises);
            res.json(quotes);
        } catch (err) {
            res.status(500).json({ error: 'Error fetching recommended quotes', details: err });
        }
    } else {
        let userData = {
            uname: "Temp user",
            upassword: passwordGenerator.generate({
                length: 25,
                numbers: true,
                symbols: true,
            }),
            tagInterest: [ ['focus', '1'], ['motivation', 2], ['art', 2], ['work', 3] , ['creativity', 1]],
            authorInterest : [['Albert Einstein', 1], ['Steve Jobs', 2], ['Pablo Picasso', 2], ['Napoleon Hill', 3], ['Thomas Edison', 1]],
            useridpub: passwordGenerator.generate({
                length: 8,
                numbers: false,
                symbols: false,
                exclude : " ",
            }),
        };

        try {

            const newUser = await UserModel.create(userData);

            const CBF = new ContentBasedFiltering();
            await CBF.setUser(newUser._id);

            let recommended = await CBF.recommend(10);

            let quotePromises = recommended.map(async (quote) => {
                return await QuoteModel.findById(quote);
            });

            let sessionId = uuidv4();
            setUser(sessionId, newUser);
            res.cookie('sessionid', sessionId);

            // Wait for all quote fetching promises to resolve
            let quotes = await Promise.all(quotePromises);
            res.json(quotes);
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'An error occurred while creating the user.' });
        }
    }
});





app.get('/getQuoteIds', async (req, res) => {
    QuoteModel.find()
        .then(quotes => res.json(quotes.map(quote => quote.quote_id)))
        .catch(err => res.json(err));
})

// quote based on the quoteId
app.post('/getQuoteById', async (req, res) => {
    const quoteId = req.body.quoteId;
    QuoteModel.findById(quoteId)
        .select('quote author_name')
        .then(quote => res.json(quote))
        .catch(err => res.json(err));
})

// getBookmarks
app.get('/getBookmarks', checkLoggedIn, async (req, res) => {
    const sessionId = req.cookies.sessionid;
    const user = await getUser(sessionId);

    let bookmarkedIds = []

    // adding bookmark id's
    BookmarkModel.find({ user: user._id })
        .then(bookmarks => {
            bookmarks.forEach(bookmark => {
                bookmarkedIds.push(bookmark.quote);
            });
        })
        .then(() => { res.json(bookmarkedIds); })
        .catch(err => res.json(err));
});

app.get('/getTrending', async (req, res) => {
    QuoteModel.find().sort({ weight: -1 }).limit(10)
        .then(quotes => res.json(quotes))
        .catch(err => res.json(err));
});


// getLikes
app.get('/getLikes', checkLoggedIn, async (req, res) => {
    const sessionId = req.cookies.sessionid;
    const user = await getUser(sessionId);
    console.log( "Email is : " +  user.uemail);

    let likeIds = []

    // adding bookmark id's
    LikeModel.find({ user: user._id })
        .then(Likes => {
            Likes.forEach(Likes => {
                likeIds.push(Likes.quote);
            });
        })
        .then(() => { console.log(likeIds) })
        .then(() => { res.json(likeIds); })
        .catch(err => res.json(err));
});



// Add a quote
app.post('/addQuote', checkLoggedIn, async (req, res) => {
    const { quote, author } = req.body;
    let time_stamp = new Date();
    const like_count = 0;
    const share_count = 0;
    const bookmark_count = 0;
    const copy_count = 0;
    const quote_id = await QuoteModel.find().countDocuments() + 1;
    const user = req.cookies.sessionid;
    let uid = await getUser(user);
    time_stamp = time_stamp.toString();
    let author_name = author;
    try {
        const createdQuote = await QuoteModel.create({ quote, author_name, time_stamp, like_count, share_count, bookmark_count, copy_count, quote_id, u_id: uid });
        res.json({ message: 'Success', quote: createdQuote });
    } catch (err) {
        console.error('Error creating quote:', err);
        res.status(500).json({ error: 'An error occurred while creating the quote.' });
    }
});



// User based on the userId
app.post('/getUserById', async (req, res) => {
    let uid = req.body.uid;
    UserModel.findById(uid)
        .then(user => res.json({ uname: user.uname, tagline: user.tagline, profileImage: user.profileImage, useridpub: user.useridpub }))
        .catch(err => res.json(err));
})

app.post('/isLiked', checkLoggedIn, async (req, res) => {
    try {
        const quoteId = req.body.quoteId;
        const sessionId = req.cookies.sessionid;
        const user = await getUser(sessionId);

        LikeModel.findOne({ user: user, quote: quoteId })
            .then(like => {
                if (like) {
                    res.json({ isLiked: true });
                } else {
                    res.json({ isLiked: false });
                }
            })
            .catch(err => res.json(err));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/isBookmarked', checkLoggedIn, async (req, res) => {
    try {
        const quoteId = req.body.quoteId;
        const sessionId = req.cookies.sessionid;
        const user = await getUser(sessionId);

        BookmarkModel.findOne({ user: user._id, quote: quoteId })
            .then(like => {
                if (like) {
                    res.json({ isBookmarked: true });
                } else {
                    res.json({ isBookmarked: false });
                }
            })
            .catch(err => res.json(err));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});




// like, share and bookmark
app.post('/updateLikeCount', checkLoggedIn, async (req, res) => {
    try {
        let quoteId = req.body.quoteId;
        let sessionId = req.cookies.sessionid;
        let userId = await getUser(sessionId);
        console.log("{like page} user id is: ", Object.keys(userId));
        LikeModel.findOneAndDelete({ user: userId, quote: quoteId })
            .then(async (like) => {
                if (like) {
                    await QuoteModel.findByIdAndUpdate(quoteId, { $inc: { like_count: -1, weight:-2 } });
                    let like_count = await LikeModel.find({ quote: quoteId }).countDocuments();
                    console.log("disliked");
                    res.json({ status: "Like decreased", like_count: like_count });
                } else {
                    await LikeModel.create({ user: userId, quote: quoteId });
                    await QuoteModel.findByIdAndUpdate(quoteId, { $inc: { like_count: 1, weight:2 } });
                    console.log("liked");
                    res.json({ status: "Like increased" });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
            });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});




app.post('/updateBookmarkCount', checkLoggedIn, async (req, res) => {
    try {
        let quoteId = req.body.quoteId;
        let sessionId = req.cookies.sessionid;
        let userId = await getUser(sessionId);

        // Find and delete the bookmark if it exists
        let bookmark = await BookmarkModel.findOneAndDelete({ user: userId, quote: quoteId });

        if (bookmark) {
            // Decrement the bookmark count in the Quote model
            await QuoteModel.findByIdAndUpdate(quoteId, { $inc: { bookmark_count: -1, weight: -2 } });
            res.json({ status: "Unbookmarked", bookmark_count: await getBookmarkCount(quoteId) });
        } else {
            // Create a new bookmark
            await BookmarkModel.create({ user: userId, quote: quoteId });
            // Increment the bookmark count in the Quote model
            await QuoteModel.findByIdAndUpdate(quoteId, { $inc: { bookmark_count: 1, weight: 2 } });
            res.json({ status: "Bookmarked", bookmark_count: await getBookmarkCount(quoteId) });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/shareQuote', checkLoggedIn, async (req, res) => {
    try {
        let quoteId = req.body.quoteId;
        let sessionId = req.cookies.sessionid;
        let userId = await getUser(sessionId)._id;

        // if user not shared by same user then update the weight
        ShareModel.findOne({ user: userId, quote: quoteId })
            .then(async (share) => {
                if (share) {
                    console.log("---"*10)
                    console.log("Already shared")
                    console.log("---"*10)
                
                }
                else {
                    QuoteModel.findByIdAndUpdate(quoteId, { $inc: { weight: 3 } })
                    .then(() => {
                        
                    })
                    .catch(err => res.json(err));

                }
            })
            .catch(err => res.json(err));

        ShareModel.create({ user: userId, quote: quoteId })
            .then(() => {
                QuoteModel.findByIdAndUpdate(quoteId, { $inc: { share_count: 1 } })
                    .then(() => res.json({ status: "Shared" }))
                    .catch(err => res.json(err));
            })
            .catch(err => res.json(err));

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/copyQuote', checkLoggedIn, async (req, res) => {
    try {
        let quoteId = req.body.quoteId;
        let sessionId = req.cookies.sessionid;
        let userId = await getUser(sessionId)._id;

        // if user not copied by same user then update the weight
        CopyModel.findOne({ user: userId, quote: quoteId })
            .then(async (copy) => {
                if (copy) {}
                else {
                    QuoteModel.findByIdAndUpdate(quoteId, { $inc: { weight: 3 } })
                    .then(() => {
                        
                    })
                    .catch(err => res.json(err));
                }
            })
            .catch(err => res.json(err));

        CopyModel.create({ user: userId, quote: quoteId })
            .then(() => {
                QuoteModel.findByIdAndUpdate(quoteId, { $inc: { copy_count: 1 } })
                    .then(() => res.json({ status: "Copied" }))
                    .catch(err => res.json(err));
            })
            .catch(err => res.json(err));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to get the current bookmark count for a quote
async function getBookmarkCount(quoteId) {
    return await BookmarkModel.find({ quote: quoteId }).countDocuments();
}



app.post('/getNewQuote', async (req, res) => {
    let quoteId = req.body.quoteId;
    if (!quoteId) {
        res.status(400).json({ error: 'Quote ID is required' });
        return;
    }
    let response = {
        quote: "This is a new quote",
        author_name: "Unknown",
        useridpub: "Unknown",
        uname: "Unknown",
        tagline: "Unknown",
        like_count: -1,
        bookmark_count: -1,
        comment_count: -1,
        isLiked: false,
        isBookmarked: false,
        quoteId: quoteId
    }

    try {
        let uid = await getUser(req.cookies.sessionid);
        if (uid) {
            uid = uid._id;
        }

        // getting quote with the quoteId
        const quote = await QuoteModel.findOne({ _id: quoteId });
        response.quote = quote.quote;
        response.author_name = quote.author_name;
        response.like_count = quote.like_count;
        response.bookmark_count = quote.bookmark_count;
        response.comment_count = quote.comment_count;


        // getting user details which is associated with the quote
        const user = await UserModel.findOne({ _id: quote.u_id });
        try {
            response.useridpub = user.useridpub;
        }
        catch (err) {
            response.useridpub = "Unknown";
        }
        response.uname = user.uname;
        response.tagline = user.tagline;


        if (uid && user) {
            const like = await LikeModel.findOne({ user: uid, quote: response.quoteId });
            response.isLiked = like ? true : false;

            const bookmark = await BookmarkModel.findOne({ user: uid.toString(), quote: response.quoteId });
            response.isBookmarked = bookmark ? true : false;
        }
        res.json(response);
    } catch (err) {
        console.error(err);
        res.json(err);
    }
});



// profile
app.get('/profile/:username', async (req, res) => {
    const username = req.params.username;
    let uid = await getUser(req.cookies.sessionid);
    if (uid) {
        try {
            uid = uid._id.toString();
            
        } catch (error) {
            console.log("Error in getting user id {profile} ");
            console.log("uid: " + uid);
        }
    }
    UserModel.findOne({
        useridpub: username,
    })
        .select('uname tagline about profileImage')
        .then(user => {
            if (user) {
                if (uid === user._id.toString()) {
                    res.json({ showEdit: true, loggedIn: true, tagline: user.tagline, about: user.about, uname: user.uname, profileImage: user.profileImage })
                }
                else {
                    res.json({ showEdit: false, loggedIn: true, tagline: user.tagline, about: user.about, uname: user.uname, profileImage: user.profileImage })
                }
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch(err => res.json(err));
}
);


app.post("/searchQuery", (req, res) => {
    res.json({ response: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi debitis consequatur facere qui sed error iste, rerum accusamus! Ut, iste ab fugit velit tempora obcaecati quibusdam temporibus voluptatem amet vero illo facere, consequatur animi impedit quas quia tenetur in. Minus, libero dolorem nihil ex rem animi iusto placeat cumque aspernatur?" })
});


// get quotes by username
app.get('/quotes/:username', async (req, res) => {
    const username = req.params.username;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    UserModel.findOne({ useridpub: username })
        .then(user => {
            if (user) {
                QuoteModel.find({ u_id: user._id })
                    .skip(skip)
                    .limit(limit)
                    .select('_id')
                    .then(quotes => {
                        const quoteids = quotes.map(quote => quote._id);
                        res.json(quoteids);
                    })
                    .catch(err => res.json(err));
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch(err => res.json(err));
});



// getTrending
app.get('/getTopTrending', async (req, res) => {
    const topTrending = await QuoteModel.find().sort({ weight: -1 }).limit(1);
    const topAuthors = await QuoteModel.find().sort({ weight: -1 }).limit(4).distinct('u_id');
    const topAuthorsDetails = await UserModel.find({ _id: { $in: topAuthors } }).limit(4).select('uname useridpub');

    for (let i = 0; i < topAuthorsDetails.length; i++) {
        topAuthorsDetails[i].profileImage = await getProfileImage(topAuthorsDetails[i].useridpub);
    }
    
    res.json({ topTrending, topAuthorsDetails });
});




// thought section
app.post('/postThought', async (req, res) => {
    console.log("Post thought");
    const sessionId = req.cookies.sessionid;
    const user = await getUser(sessionId);
    const thought = req.body.thought;
    const quoteId = req.body.quoteId;

    if (!thought) {
        res.status(400).json({ error: 'Thought is required' });
        return;
    }


    try {
        const newThought = await ThoughtModel.create({ userid: user._id, thought: thought, quoteid: quoteId });
        await QuoteModel.findByIdAndUpdate(quoteId, { $inc: { comment_count: 1, weight: 3 } });
        res.json({ message: 'Thought posted', thoughtid: newThought._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/getThoughts', async (req, res) => {
    const quoteId = req.body.quoteId;
    const sessionId = req.cookies.sessionid;
    const user = await getUser(sessionId);

    if (user) {
        try {
            const thoughts = await ThoughtModel.find({ quoteid: quoteId }).sort({ likes: -1 });
            const thoughtIds = thoughts.map(thought => thought._id);
            res.json(thoughtIds);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});


app.post('/getThought', async (req, res) => {
    try {
        const sessionId = req.cookies.sessionid;
        const user = await getUser(sessionId);
        const thoughtid = req.body.thoughtid;

        // Collecting the thought information using the Thought model
        const thoughtDoc = await ThoughtModel.findOne({ _id: thoughtid });
        if (!thoughtDoc) {
            return res.status(404).json({ error: 'Thought not found' });
        }

        // Converting the thought document to a plain JavaScript object
        const thought = thoughtDoc.toObject();

        // Collecting the user information using the User model
        const userInformation = await UserModel.findOne({ _id: thought.userid });
        if (!userInformation) {
            return res.status(404).json({ error: 'User not found' });
        }
    
        // Setting the username and tagline
        thought.username = userInformation['uname'];
        thought.tagline = userInformation['tagline'];
        thought.userImage = await getProfileImage(userInformation['useridpub']);

        const like = await ThoughtLikeModel.findOne({ thought: thoughtid, user: user._id });
        thought.isLiked = like ? true : false;

        res.json({ thought });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// likeThought
app.post('/likeThought', async (req, res) => {
    const sessionId = req.cookies.sessionid;
    const user = await getUser(sessionId);
    const thoughtid = req.body.thoughtid;
    const liked = req.body.liked;

    if (user) {
        try {
            const thought = await ThoughtModel.findById(thoughtid);
            if (!thought) {
                return res.status(404).json({ error: 'Thought not found' });
            }

            const like = await ThoughtLikeModel.findOne({ thought: thoughtid, user: user._id });
            if (liked) {
                if (!like) {
                    await ThoughtLikeModel.create({ thought: thoughtid, user: user._id });
                    await ThoughtModel.findByIdAndUpdate(thoughtid, { $inc: { likes: 1 } });
                }
            } else {
                if (like) {
                    await ThoughtLikeModel.findByIdAndDelete(like._id);
                    await ThoughtModel.findByIdAndUpdate(thoughtid, { $inc: { likes: -1 } });
                }
            }

            res.json({ message: 'Success' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
