const dotenv = require("dotenv")
dotenv.config()
const express = require("express");
const app = express();
const auth = require("./routes/auth")
const vehicleInfo = require("./routes/vehicle-info")
const cors = require('cors')


app.use(cors())

app.use(express.json())

app.use(express.static('build'))

app.use("/auth", auth)

app.use("/api", vehicleInfo)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server is running on port ${PORT}`)