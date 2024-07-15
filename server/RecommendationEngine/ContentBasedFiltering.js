// importing mongoose
// const mongoose = require('mongoose');
// const mongoURI = 'mongodb://localhost:27017/quote_plateform';
// mongoose.connect(mongoURI);


const importTest = require('../testImport.js');
let mongoose = require('../connection.js');

const QuoteModel = require('..//models//Quote.js');
const UserModel = require('..//models//User.js');
const FollowModel = require('..//models//Follow.js');
const LikeModel = require('..//models//Like.js');
const BookmarkModel = require('..//models//Bookmark.js');
const seenQuote = require('..//models//SeenQuotes.js');
const CopyModel = require('..//models//Copy.js');
const ShareModel = require('..//models//Share.js');
const TagModel = require('..//models//Tags.js');

class ContentBasedFiltering {
    constructor() {
        this.authors = {
            1: "Oscar Wilde",
            2: "Albert Einstein",
            3: "Frank Zappa",
            4: "Mahatma Gandhi",
            5: "Mark Twain",
            6: "Friedrich Nietzsche",
            7: "Oscar Wilde",
            8: "Oscar Wilde",
            9: "Albert Einstein",
            10: "Friedrich Nietzsche",
            11: "unknown"
        };

        this.init_tags = {
            1: "inspirational",
            2: "humor",
            3: "books",
            4: "change",
            5: "truth",
            6: "sad",
            7: "dukhi"
        };

        this.SENTIMENTS = {
            'Sad': [
                'melancholy', 'heartache', 'sorrow', 'grief', 'loss', 'loneliness',
                'despair', 'sadness', 'disappointment', 'regret', 'pain', 'mourning',
                'hurt', 'tears', 'melancholia', 'gloom', 'blue', 'downcast', 'depression',
                'solitude', 'hopelessness', 'tragedy', 'broken', 'yearning', 'melancholic', 'unhappy', 'sad', 'dukhi'
            ],
            'Neutral': [
                'balance', 'calm', 'serenity', 'equilibrium', 'moderate', 'neutrality',
                'indifference', 'unbiased', 'objective', 'impartial', 'middle-ground',
                'average', 'ordinary', 'standard', 'unemotional', 'steady', 'even',
                'unremarkable', 'undisturbed', 'placid', 'content', 'tranquil', 'detached',
                'dispassionate', 'level-headed', 'inspirational'
            ],
            'Happy': [
                'joy', 'elation', 'happiness', 'excitement', 'cheerful', 'delight',
                'bliss', 'ecstasy', 'contentment', 'glee', 'mirth', 'jubilant',
                'euphoria', 'radiant', 'sunny', 'joyful', 'blessed', 'thrilled', 'overjoyed',
                'buoyant', 'elevated', 'blissful', 'satisfied', 'grateful', 'optimistic', 'inspirational'
            ]
        };

        this.recommendation_ratio = {
            'Sad': [40, 20, 10, 30],
            'Neutral': [20, 40, 20, 20],
            'Happy': [10, 20, 40, 30]
        };

        this.inspiration = [21, 22, 23, 24, 25];
        this.humor = [9, 1, 13, 14, 15];
        this.books = [16, 15, 18, 3, 20];
        this.change = [6, 15, 1, 2, 26];
        this.truth = [2, 1, 15, 6, 30];
        this.sad = [];
        for (let i = 31; i <= 35; i++) {
            this.sad.push(i);
        }
        this.dukhi = [36, 37, 38, 39, 40, 41, 42];


        this.interactions = {
            'user1': { 1: 'like', 3: 'view', 6: 'like', 8: 'share', 9: 'share', 10: 'view' },
            'user2': { 2: 'like', 4: 'like', 5: 'view', 7: 'like' },
            'user3': { 8: 'view', 10: 'like' },
            'sadUser': { 33: 'like', 34: 'share', 37: 'like', 1: 'share' },
            'inspired_user': { 21: 'like', 22: 'like' }
        };

        this.TAGS = {
            'inspirational': this.inspiration,
            'humor': this.humor,
        };
    }

    async getInteractions(lasttime = new Date()) {
        let interactions = {};

        try {
            let likes = await LikeModel.find({ user: this.userId, liked_at: { "$gte": lasttime } }).sort({ liked_at: -1 });
            let shares = await ShareModel.find({ user: this.userId, shared_at: { "$gte": lasttime } }).sort({ shared_at: -1 }).limit(10);
            let bookmarks = await BookmarkModel.find({ user: this.userId, bookmarked_at: { "$gte": lasttime } }).sort({ bookmarked_at: -1 }).limit(10);
            let copies = await CopyModel.find({ user: this.userId, copied_at: { "$gte": lasttime } }).sort({ copied_at: -1 }).limit(10);

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

    async getInteractedAuthors(userId, lasttime = new Date()) {
        let authors = [];
        let interactions = await this.getInteractions(lasttime);
        const quotes = Object.keys(interactions);
        for (let quote of quotes) {
            let author = await QuoteModel.findById(quote).select('u_id').lean();
            authors.push(author.u_id);
        }
        return authors;
    }



    async getTags(quoteId) {
        let tags = [];
        try {
            tags = await QuoteModel.findById(quoteId).select('tag').lean();
            tags = tags.tag;
            return tags;
        } catch (err) {
            console.log(err);
        }
    }

    async setInterest(userId) {
        let USER = await UserModel.findById(userId);
        let oldTagInterest = USER.tagInterest;
        let latestInteractions = await this.getInteractions(USER.updatedIntestTime[0]);
        let quoteId = Object.keys(latestInteractions);
        let tags = [];
        for (let quote of quoteId) {
            tags = tags.concat(await this.getTags(quote));
        }
        let newTagInterest = this.countOccurrences(tags);
        // converting tags to string and count as it is
        newTagInterest = Object.entries(newTagInterest).map(([tag, count]) => [tag, count]);
        let mergedTagInterest = this.mergeAndSortInteractions(oldTagInterest, newTagInterest, 0.6);

        // for authors
        let oldAuthorInterest = USER.authorInterest;
        let authors = await this.getInteractedAuthors(userId, USER.updatedIntestTime[1]);
        let newAuthorInterest = this.countOccurrences(authors);
        newAuthorInterest = Object.entries(newAuthorInterest).map(([author, count]) => [author, count]);
        let mergedAuthorInterest = this.mergeAndSortInteractions(oldAuthorInterest, newAuthorInterest, 0.6);

        // update the user document with the new interests
        USER.tagInterest = mergedTagInterest;
        USER.authorInterest = mergedAuthorInterest;
        USER.updatedIntestTime = [new Date(), new Date()];
        await USER.save();
    }

    mergeAndSortInteractions(oldInteractions, latestInteractions, decayFactor) {
        let interactionMap = new Map();

        // Process old interactions, apply decay factor, and store them in the map
        for (let [tag, count] of oldInteractions) {
            interactionMap.set(tag, { count: count * decayFactor, recent: false });
        }

        // Update the map with the latest interactions
        for (let [tag, count] of latestInteractions) {
            if (interactionMap.has(tag)) {
                interactionMap.get(tag).count += count;
                interactionMap.get(tag).recent = true;
            } else {
                interactionMap.set(tag, { count: count, recent: true });
            }
        }

        // Convert the map to an array and sort it
        let mergedInteractions = Array.from(interactionMap.entries())
            .map(([tag, info]) => [tag, info.count, info.recent])
            .sort((a, b) => {
                // Sort by recent status first, then by count
                if (a[2] === b[2]) {
                    return b[1] - a[1]; // Sort by count if both are recent or both are old
                }
                return b[2] - a[2]; // Sort by recent status
            })
            .map(([tag, count]) => [tag, count]);
        
        // removing interaction that are count have less then 0.01
        mergedInteractions = mergedInteractions.filter(([tag, count]) => count >= 0.01);

        return mergedInteractions;
    }

    async setUser(userId) {
        this.userId = userId;
        this.fav_tags = [];
        (async () => {
            let user = await this.getInteractions();

            const quotes = Object.keys(user);
            let fav_tags = [];

            for (let quote of quotes) {
                let tags = await this.getTags(quote);
                fav_tags = fav_tags.concat(tags);
            }
            const counted = this.countOccurrences(fav_tags);
            this.fav_tags = this.getMostCommon(counted, 5);
        })();
    }

    getSentiment() {
        let sentiment_score = { 'Neutral': 0, 'Sad': 0, 'Happy': 0 };
        for (let [tag, count] of this.fav_tags) {
            for (let [sentiment, words] of Object.entries(this.SENTIMENTS)) {
                for (let word of words) {
                    if (word === tag) {
                        sentiment_score[sentiment] += count;
                    }
                }
            }
        }
        return Object.keys(sentiment_score).reduce((a, b) => sentiment_score[a] > sentiment_score[b] ? a : b);
    }

    async getUnseenQuotes(tag, n) {
        let quoteIds = [];
        let userId = this.userId;
        try {
            // Fetch quote IDs with the given sentiment
            let quotes = await QuoteModel.find({ tag: tag }).select('_id').lean();
            let allQuoteIds = quotes.map(quote => quote._id.toString());

            // Fetch seen quote IDs for the user
            let seenQuotes = await seenQuote.find({ user: userId, quote: { $in: allQuoteIds } }).select('quote').lean();
            let seenQuoteIds = seenQuotes.map(seenQuote => seenQuote.quote.toString());

            // Filter out seen quotes
            quoteIds = allQuoteIds.filter(quoteId => !seenQuoteIds.includes(quoteId));

            // Limit the number of unseen quotes to n
            if (quoteIds.length > n) {
                quoteIds = quoteIds.slice(0, n);
            }

        } catch (err) {
            console.log(err);
        }

        return quoteIds;
    }

    async getRandomQuotes(n, userId) {
        try {
          // Get the count of all quotes in the collection
          const totalQuotes = await QuoteModel.countDocuments();
    
          // Fetch the IDs of quotes that have already been seen by the user
          const seenQuotes = await seenQuote.find({ user: userId }).select('quote').exec();
          const seenQuoteIds = seenQuotes.map(sq => sq.quote.toString());
    
          // Generate random indexes, allowing for a buffer to account for seen quotes
          const randomIndexes = Array.from({ length: n * 1.5 }, () => Math.floor(Math.random() * totalQuotes));
    
          // Fetch random quotes' IDs, filtering out those already seen
          const randomQuoteIds = await Promise.all(
            randomIndexes.map(async (index) => {
              const quote = await QuoteModel.findOne().skip(index).select('_id').exec();
              return quote ? quote._id.toString() : null;
            })
          );
    
          // Remove nulls and duplicates
          const uniqueQuoteIds = [...new Set(randomQuoteIds)].filter(id => id && !seenQuoteIds.includes(id));
    
          // Return only the required number of unique, unseen quote IDs
          return uniqueQuoteIds.slice(0, n);
        } catch (error) {
          console.error('Error fetching random quote IDs:', error);
          return [];
        } finally {
          // No need to close the database connection here as it might be managed elsewhere
        }
      }
    async getUnseenQuotesFilterByAuthor(author, n, shortByWeight = false) {
        let quoteIds = [];
        let userId = this.userId;
        let quotes;
        try {
            // Fetch quote IDs with the given sentiment
            if (shortByWeight) {
                quotes = await QuoteModel.find({ u_id: author }).select('_id').sort({ weight: -1 }).lean();
            }
            else {
                quotes = await QuoteModel.find({ u_id: author }).select('_id').lean();
            }
            let allQuoteIds =  quotes.map(quote => quote._id.toString());

            // Fetch seen quote IDs for the user
            let seenQuotes = await seenQuote.find({ user: userId, quote: { $in: allQuoteIds } }).select('quote').lean();
            let seenQuoteIds = seenQuotes.map(seenQuote => seenQuote.quote.toString());

            // Filter out seen quotes
            quoteIds = allQuoteIds.filter(quoteId => !seenQuoteIds.includes(quoteId));

            // Limit the number of unseen quotes to n
            if (quoteIds.length > n) {
                quoteIds = quoteIds.slice(0, n);
            }

        } catch (err) {
            console.log(err);
        }
        return quoteIds;
    }


    async markAsSeen(quoteIds) {

        if (!quoteIds.length) {
            return;
        }

        let userId = this.userId;
        for (let quoteId of quoteIds) {
            // if user already seen the quote then don't insert it again
            let seen = await seenQuote.findOne({ user: userId, quote: quoteId });
            if (seen) {
                continue;
            }
            else {
                let seenQuoteInstance = new seenQuote({ user: userId, quote: quoteId });
                await seenQuoteInstance.save();

            }
            // downgrading the weight of the quote
            let quote = await QuoteModel.findById(quoteId);
            quote.weight = quote.weight - 1;
        }
    }
    async recommend(n = 16) {
        let USER = await UserModel.findById(this.userId);
        if (!USER) {
            
            console.log('User not found', this.userId);
            return;
        }

        // if user seen 50 quotes then update the interests
        let lastUpdate = USER.updatedIntestTime[0];
        let lastUpdateDate = new Date(lastUpdate);

        let seenQuotes = await seenQuote.find({ user: this.userId, seen_at: { "$gte": lastUpdateDate } })
        let seenCount = seenQuotes.length;
        if (seenCount >= 10) {
            console.log('Interest updating...');
            await this.setInterest(this.userId);
        }


        let tagBasedRecommendation = [];
        let tagInterest = USER.tagInterest;
        let tags = tagInterest.map(([tag, count]) => tag);

        for (let tag of tags) {
            let quotes = await this.getUnseenQuotes(tag, 4);
            tagBasedRecommendation.push(...quotes);
        }


        // author based recommendation  
        let authorBasedRecommendation = [];
        let authorInterest = USER.authorInterest;
        let authors = authorInterest.map(([author, count]) => author);

        for (let author of authors) {
            let quotes = await this.getUnseenQuotesFilterByAuthor(author, 4);
            authorBasedRecommendation.push(...quotes);
        }


        // merge the two recommendation lists
        let recommendation = tagBasedRecommendation.concat(authorBasedRecommendation);
        let uniqueRecommendation = [...new Set(recommendation)];
        let finalRecommendation = uniqueRecommendation.slice(0, n);
        this.markAsSeen(finalRecommendation);


        if (finalRecommendation.length < n) {
            let randomQuotes = await this.getRandomQuotes(5);
            finalRecommendation.push(...randomQuotes);
            this.markAsSeen(randomQuotes);
        }

        // scrambelling
        finalRecommendation.sort(() => Math.random() - 0.5);
        return finalRecommendation;
    }


    async getFollowingRecommendation(n = 15) {

        let USER = await UserModel.findById(this.userId);
        if (!USER) {
            console.log('User not found');
            return;
        }

        // getting the following list of the user
        let following = await FollowModel.find({ follower: this.userId }).select('following').lean();
        let followingList = following.map(follow => follow.following);


        // rules : only unseen quotes, only 5 quotes from each author and shorted by weights
        let recommendation = [];

        for (let author of followingList) {
            let quotes = await this.getUnseenQuotesFilterByAuthor(author, 5, true);
            recommendation.push(...quotes);
        }

        this.markAsSeen(recommendation);
        return recommendation;
    }
    countOccurrences(arr) {
        return arr.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {});
    }

    getMostCommon(obj, num) {
        return Object.entries(obj).sort(([, a], [, b]) => b - a).slice(0, num);
    }
}


// // checking connection
// mongoose.connection.on('connected', async () => {
//     const CBF = new ContentBasedFiltering();
//     await CBF.setUser('6685908ad22dcfb39875f4b6');
//     let recommended = await CBF.getFollowingRecommendation();
//     console.log(recommended)
// });


module.exports = ContentBasedFiltering;