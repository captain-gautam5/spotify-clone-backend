const mongoose = require("mongoose");
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);


const connectdb = async () => {

    try {
        await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log("Connected to database successfully");
    } catch (error) {
        console.log("Error connecting to database", error);
    }
};

module.exports = connectdb;