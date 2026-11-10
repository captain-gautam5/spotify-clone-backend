const mongoose = require("mongoose");

const newschema = new mongoose.Schema({

    username: {
        type: String,
        unique: true, // is not unique mongo ddb throws a duplicate key error ❌
        required: true // if not filled mongo ddb throws a required error ❌
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["artist", "user"],
        default: "user"
    }

})
const usermodel = mongoose.model("user", newschema);
module.exports = usermodel;