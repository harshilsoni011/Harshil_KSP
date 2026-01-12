const TagService = require("../../db/services/TagService");

exports.trending = async () => {
    const tags = await TagService.getTrendingTags();
    return { tags };
};
