const mongoose = require("mongoose");

const musicschema = new mongoose.Schema({

    song: {
        type: String,
        required: true,
    }, title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,

    }
})

const musicmodel = mongoose.model("songs", musicschema)

module.exports = musicmodel;