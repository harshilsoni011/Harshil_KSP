const ValidationError = require("../../utils/ValidationError");
const User = require("../models/user");
const { TableFields } = require("../../utils/constants");

class UserService {
    static findByEmail = (email) => {
        return User.findOne({ [TableFields.email]: email.toLowerCase().trim() });
    };

    static findById = (userId) => {
        return User.findById(userId);
    };

    static existsWithEmail = async (email) => {
        return await User.exists({ [TableFields.email]: email.toLowerCase().trim() });
    };

    static createUser = async (userData) => {
        const { name, email, password } = userData;
        console.log("==>",name, email, password)

        if (!name || !email || !password) {
            throw new ValidationError("Name email and password are required");
        }

        const existing = await UserService.existsWithEmail(email);
        if (existing) {
            throw new ValidationError("Email already registered");
        }

        const user = new User({ [TableFields.name_]: name, [TableFields.email]: email, [TableFields.password]: password });
        await user.save();

        return user;
    };

    static updateReputation = async (userId, reputationDelta) => {
        return await User.findByIdAndUpdate(
            userId,
            { $inc: { [TableFields.reputation]: reputationDelta } },
            { new: true }
        );
    };

    static getTopUsers = async (limit = 10) => {
        return await User.find({})
            .sort({ [TableFields.reputation]: -1 })
            .limit(limit)
            .select(`${TableFields.name_} ${TableFields.email} ${TableFields.reputation}`);
    };
}

module.exports = UserService;
