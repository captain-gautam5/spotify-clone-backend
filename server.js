require("dotenv").config();
const connectdb = require("./src/db/db");

const app = require("./src/app")



connectdb();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})