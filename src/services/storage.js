const { ImageKit } = require("@imagekit/nodejs")

const imgclient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

const musicfile = async (file, fileName = "music") => {
    const result = await imgclient.files.upload({
        file,
        fileName,
        folder: "spotify-app/music"
    })
    return result
}

const imgfile = async (file, fileName = "image") => {
    const result = await imgclient.files.upload({
        file,
        fileName,
        folder: "spotify-app/images"
    })
    return result
}

module.exports = { musicfile, imgfile }
