const UserService = require("../../db/services/UserService");

exports.topUsers = async () => {
    const users = await UserService.getTopUsers();
    return { users };
};

exports.me = async (req) => {
    return { user: req.user };
};
