const jwt = require("jsonwebtoken");

const authartist = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                message: "unauthorised login or register first "
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded.role != "artist") {
            return res.status(403).json({
                message: "access denied"
            })
        }
        req.user = decoded;

        next()
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "you dont have access"
        })
    }
}

const authuser = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "unauthorized"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded.role != "artist" && decoded.role != "user") {
            return res.status(403).json({
                message: "access denied for you as you are not an artist or user"
            })
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "unauthorized"
        })
    }
}

module.exports = { authartist, authuser };
