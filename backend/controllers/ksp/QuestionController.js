const QuestionService = require("../../db/services/QuestionService");
const CustomError = require("../../utils/ValidationError");
const { TableFields, TableNames, ValidationMsgs } = require("../../utils/constants");
const Question = require("../../db/models/question");
const mongoose = require("mongoose");
const { MongoUtil } = require("../../db/mongoose");
const ValidationError = require("../../utils/ValidationError");

exports.list = async (req) => {
    return await QuestionService.listQuestions(req.query);
};

exports.create = async (req) => {
    const title = req.body[TableFields.title];
    const body = req.body[TableFields.body];
    const tags = req.body[TableFields.tags];

    const question = await QuestionService.createQuestion({
        title,
        body,
        tags,
        authorId: req.user[TableFields.ID],
    });

    return { question };
};

exports.details = async (req) => {
    const { id } = req.params;

    if(!MongoUtil.isValidObjectID(id)) throw new ValidationError(ValidationMsgs.InvalidUserId)

    const pipeline = [
        { $match: { [TableFields.ID]: new mongoose.Types.ObjectId(id) } },

        {
            $lookup: {
                from: TableNames.User,
                localField: TableFields.author,
                foreignField: TableFields.ID,
                as: TableFields.author,
            },
        },
        { $unwind: `$${TableFields.author}` },
        {
            $addFields: {
                [`${TableFields.author}.${TableFields.password}`]: "$$REMOVE",
            }
        },
        {
            $project: {
                [`${TableFields.author}.${TableFields.password}`]: 0,
            }
        },
        {
            $lookup: {
                from: TableNames.Answer,
                let: { questionId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: [`$${TableFields.question}`, "$$questionId"] } } },
                    { $sort: { [TableFields.createdAt]: 1 } },
                    {
                        $lookup: {
                            from: TableNames.User,
                            localField: TableFields.author,
                            foreignField: TableFields.ID,
                            as: TableFields.author,
                        },
                    },
                    { $unwind: `$${TableFields.author}` },
                    {
                        $project: {
                            [`${TableFields.author}.${TableFields.password}`]: 0,
                        }
                    },
                    {
                        $lookup: {
                            from: TableNames.Comment,
                            let: { answerId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: [`$${TableFields.targetId}`, "$$answerId"] },
                                                { $eq: [`$${TableFields.targetType}`, "answer"] },
                                            ],
                                        },
                                    },
                                },
                                { $sort: { [TableFields.createdAt]: 1 } },
                                {
                                    $lookup: {
                                        from: TableNames.User,
                                        localField: TableFields.author,
                                        foreignField: TableFields.ID,
                                        as: TableFields.author,
                                    },
                                },
                                { $unwind: `$${TableFields.author}` },
                                {
                                    $project: {
                                        [`${TableFields.author}.${TableFields.password}`]: 0,
                                    }
                                },
                            ],
                            as: "comments",
                        },
                    },
                ],
                as: "answers",
            },
        },
        {
            $lookup: {
                from: TableNames.Comment,
                let: { questionId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: [`$${TableFields.targetId}`, "$$questionId"] },
                                    { $eq: [`$${TableFields.targetType}`, "question"] },
                                ],
                            },
                        },
                    },
                    { $sort: { [TableFields.createdAt]: 1 } },
                    {
                        $lookup: {
                            from: TableNames.User,
                            localField: TableFields.author,
                            foreignField: TableFields.ID,
                            as: TableFields.author,
                        },
                    },
                    { $unwind: `$${TableFields.author}` },
                    {
                        $project: {
                            [`${TableFields.author}.${TableFields.password}`]: 0,
                        }
                    },
                ],
                as: "comments",
            },
        },
    ];

    const result = await Question.aggregate(pipeline);

    if (!result || result.length === 0) {
        throw new CustomError("Question not found");
    }

    const questionDoc = result[0];
    const { answers, comments, ...questionData } = questionDoc;

    return {
        question: questionData,
        answers,
        comments,
    };
};
