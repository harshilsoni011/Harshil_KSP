const jwt = require("jsonwebtoken");
const User = require("../db/models/user");

module.exports = async function userAuth(req, res, next) {
    try {
        const authHeader = req.header("Authorization") || "";
        const token = authHeader.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const secret =
            process.env.JWT_USER_PK

        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({ error: "Authentication failed" });
    }
};

