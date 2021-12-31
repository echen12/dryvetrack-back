const dotenv = require("dotenv")
dotenv.config()
const express = require("express");
const app = express();
const auth = require("./routes/auth")
const vehicleInfo = require("./routes/vehicle-info")
const cors = require('cors')


app.use(cors())

app.use(express.json())

app.use("/auth", auth)

app.use("/api", vehicleInfo)

app.listen(3000, () => {
    console.log("Running on port 3000")
})