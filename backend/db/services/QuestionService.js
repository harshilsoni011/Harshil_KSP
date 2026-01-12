const ValidationError = require("../../utils/ValidationError");
const Question = require("../models/question");
const { TableFields } = require("../../utils/constants");

class QuestionService {
    static findById = (questionId) => {
        return Question.findById(questionId).populate(TableFields.author, `${TableFields.name_} ${TableFields.reputation}`);
    };

    static findByIdBasic = (questionId) => {
        return Question.findById(questionId);
    };

    static listQuestions = async (query, pagination) => {
        const { search, tag, page = 1, limit = 10 } = query;

        const mongoQuery = {};
        if (search && search.trim()) {
            mongoQuery.$text = { $search: search.trim() };
        }
        if (tag) {
            mongoQuery[TableFields.tags] = tag.toLowerCase();
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [items, total] = await Promise.all([
            Question.find(mongoQuery)
                .sort({ [TableFields.createdAt]: -1 })
                .skip(skip)
                .limit(Number(limit))
                .populate(TableFields.author, `${TableFields.name_} ${TableFields.reputation}`),
            Question.countDocuments(mongoQuery),
        ]);

        return {
            data: items,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit)) || 1,
            },
        };
    };

    static createQuestion = async (questionData) => {
        const { title, body, tags, authorId } = questionData;

        if (!title || !body) {
            throw new ValidationError("Title and body are required");
        }

        const normalizedTags =
            Array.isArray(tags) && tags.length
                ? tags.map((t) => `${t}`.toLowerCase().trim()).filter(Boolean)
                : [];

        const question = await Question.create({
            [TableFields.title]: title,
            [TableFields.body]: body,
            [TableFields.tags]: normalizedTags,
            [TableFields.author]: authorId,
        });

        return question;
    };

    static updateScore = async (questionId, score) => {
        return await Question.findByIdAndUpdate(
            questionId,
            { $inc: { [TableFields.score]: score } },
            { new: true }
        );
    };

    static getTrendingTags = async (limit = 10) => {
        return await Question.aggregate([
            { $unwind: `$${TableFields.tags}` },
            {
                $group: {
                    _id: `$${TableFields.tags}`,
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: limit },
        ]);
    };
}

module.exports = QuestionService;
