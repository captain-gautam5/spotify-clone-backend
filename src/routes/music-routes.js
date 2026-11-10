const express = require("express");
const multer = require("multer");
const musiccontroller = require("../controllers/music-controller")

const authmiddleware = require("../middlewares/auth-middleware")

const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router();

router.post(

    "/upload",
    authmiddleware.authartist,
    upload.fields([
        { name: "music", maxCount: 1 },
        { name: "image", maxCount: 1 }
    ]),
    musiccontroller.createmusic
);
router.post("/album", authmiddleware.authartist, upload.single("image"), musiccontroller.createalbum)

router.get("/", authmiddleware.authuser, musiccontroller.getmusic)

module.exports = router;