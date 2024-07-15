
import ContentBasedFiltering from './ContentBasedFiltering.js';

class RecommendationAPI {
    constructor(userId) {
        this.userId = userId;
        this.CBF = new ContentBasedFiltering();
    }

    getRecommendations(n = 16) {
        return this.CBF.recommend(n);
    }

    getMostCommonTags(num) {
        const allTags = Object.keys(this.CBF.TAGS);
        const allTagsCount = this.CBF.countOccurrences(allTags);
        return this.CBF.getMostCommon(allTagsCount, num);
    }

    getSentiment() {
        return this.CBF.getSentiment();
    }
}

export default RecommendationAPI;