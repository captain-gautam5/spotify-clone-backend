const usermodel = require("../models/user-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registeruser = async (req, res) => {

    const { username, email, password, role = "user" } = req.body;//role set to user default if user doesnt enter anyhting in role



    const userpresent = await usermodel.findOne({

        $or: [
            { username },
            { email }
        ]
    })

    if (userpresent) {
        return res.status(400)
            .json({
                message: "User already exists"
            })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await usermodel.create({
        email,
        password: hash,
        username,
        role
    })

    const token = jwt.sign({
        id: user._id,
        role: user.role,

    }, process.env.JWT_SECRET);

    res.cookie("token", token);

    res.status(201).json({
        message: "user registered successfully",
        ID: user._id,
        email: user.email,
        username: user.username,
        role: user.role
    })
};

const loginuser = async (req, res) => {

    const { username, email, password } = req.body

    const user = await usermodel.findOne({

        $or: [
            { username },
            { email }
        ]

    })
    if (!user) {

        return res.status(401).json({
            message: "invalid credentials register first",
        })
    }

    const passwordcheck = await bcrypt.compare(password, user.password)

    if (!passwordcheck) {
        return res.status(401).json({
            message: "invalid password",
        })
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    return res.status(200).json({
        message: "user logged in successfully",
        user
    })

};

async function logoutuser(req, res) {
    res.clearCookie("token")
    res.status(200).json({
        message: "user logged out successfully"
    })
}


module.exports = { registeruser, loginuser, logoutuser };