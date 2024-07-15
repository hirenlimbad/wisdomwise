// rules for quote trending.
// 1) getting the total interactions of recent interactions (will be calculated depending upon last time calculated trending feed)
// 2) one dictionary will be maintained with quote id and there weights.
// 3) weights will be calculated, weights = (Likes×1)+(Copy×2)+(Shares×3)+(Views×0.5)
// 4) time decay function will apply.
// 5) top 10 quotes will be shown up on trending feed.
// 6) trending quote will be shown to the user also.

// importing mongoose
const mongoose = require('../connection.js');


const QuoteModel = require('../../models/Quote.js');
const UserModel = require('../../models/User.js');
const FollowModel = require('../../models/Follow.js');
const LikeModel = require('../../models/Like.js');
const BookmarkModel = require('../../models/Bookmark.js');
const seenQuote = require('../../models/SeenQuotes.js');
const CopyModel = require('../../models/Copy.js');
const ShareModel = require('../../models/Share.js');
const TagModel = require('../../models/Tags.js');
const TrendingModel = require('../../models/Trending.js');





class TrendingEngine {
    constructor() {
        this.quote_id = [];
        this.weight = [];
    }

    async getInteractions(lasttime = new Date()) {
        let interactions = {};

        try {
            let likes = await LikeModel.find({liked_at: {"$gte": lasttime } });
            let shares = await ShareModel.find({shared_at: {"$gte":lasttime } });
            let bookmarks = await BookmarkModel.find({ bookmarked_at: {"$gte":lasttime } });
            let copies = await CopyModel.find({ copied_at: {"$gte":lasttime } });

            for (let like of likes) {
                if (!interactions[like.quote]) {
                    interactions[like.quote] = 'like';
                }
            }

            for (let share of shares) {
                if (!interactions[share.quote]) {
                    interactions[share.quote] = 'share';
                }
            }

            for (let bookmark of bookmarks) {
                if (!interactions[bookmark.quote]) {
                    interactions[bookmark.quote] = 'bookmark';
                }
            }

            for (let copy of copies) {
                if (!interactions[copy.quote]) {
                    interactions[copy.quote] = 'copy';
                }
            }

        } catch (err) {
            console.log(err);
        }
        return interactions;
    }

    async calculateWeights(interactions) {
        for (let quote in interactions) {
            let weight = 0;
            if (interactions[quote] === 'like') {
                weight += 1;
            } else if (interactions[quote] === 'copy') {
                weight += 2;
            } else if (interactions[quote] === 'share') {
                weight += 3;
            }
            this.quote_id.push(quote);
            this.weight.push(weight);
        }
    }
}

mongoose.connection.on('connected', async () => {
    let trending = await TrendingModel.find({});
    const lastUpdatedTime = trending[0].updatedAt;
    const TE = new TrendingEngine();
    const interactions = await TE.getInteractions(lastUpdatedTime);
    console.log(interactions);
    // console.log(trending);
});
