const musicmodel = require("../models/music-model")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const { musicfile, imgfile } = require("../services/storage")
const albummodel = require("../models/album-model")

const createmusic = async (req, res) => {

    try {
        const { title } = req.body;
        const files = req.files;
        console.log(files);

        const musicFile = req.files["music"]?.[0];
        const imageFile = req.files["image"]?.[0];
        console.log(musicFile, imageFile);

        if (!musicFile || !imageFile) {
            return res.status(400).json({ message: "Both music and image files are required" });
        }

        const result1 = await imgfile(imageFile.buffer.toString("base64"), imageFile.originalname)
        const result2 = await musicfile(musicFile.buffer.toString("base64"), musicFile.originalname)
        console.log(result1, result2);

        const music = await musicmodel.create({
            song: result2.url,
            title,
            image: result1.url,
            artist: req.user.id,
        })

        res.status(201).json({
            message: "song created successfully",
            music,
        })
    } catch (error) {
        return res.status(403).json({
            message: "an error occured ", error
        })
    }
}

const createalbum = async (req, res) => {
    try {
        const { title } = req.body;
        let { musics } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Album image is required" });
        }

        if (!musics) {
            return res.status(400).json({ message: "musics is required" });
        }

        // In multipart/form-data, non-file fields arrive as strings.
        // If sent as JSON string '["id1", "id2"]', parse it.
        // If sent as comma-separated "id1, id2", split it.
        if (typeof musics === "string") {
            try {
                musics = JSON.parse(musics);
            } catch (err) {
                musics = musics.includes(",")
                    ? musics.split(",").map((id) => id.trim())
                    : [musics.trim()];
            }
        }

        if (!Array.isArray(musics)) {
            musics = [musics];
        }


        const file = req.file;
        const result = await imgfile(file.buffer.toString("base64"), file.originalname);

        const album = await albummodel.create({
            image: result.url,
            title,
            musics: musics,
            artist: req.user.id,
        });

        res.status(201).json({
            message: "Album created successfully",
            album,
        });
    } catch (error) {
        return res.status(400).json({
            message: "an error occurred while creating album",
            error: error.message || error,
        });
    }
}

const getmusic = async (req, res) => {
    try {
        const musics = await musicmodel.find().populate("artist", "username email");

        res.status(200).json({
            message: "musics fetched successfully",
            musics: musics
        });
    } catch (error) {
        res.status(500).json({
            message: "error fetching music",
            error: error.message || error
        });
    }
}




module.exports = { createmusic, createalbum, getmusic }
