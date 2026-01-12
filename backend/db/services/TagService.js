const QuestionService = require("./QuestionService");

class TagService {
    static getTrendingTags = async (limit = 10) => {
        return await QuestionService.getTrendingTags(limit);
    };
}

module.exports = TagService;
