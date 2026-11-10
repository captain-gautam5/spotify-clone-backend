const mongoose = require("mongoose")

const albumschema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    musics: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'songs',
            required: true,
        }
    ],
    artist: {
        ref: "user",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const albummodel = mongoose.model("album", albumschema);
module.exports = albummodel;
