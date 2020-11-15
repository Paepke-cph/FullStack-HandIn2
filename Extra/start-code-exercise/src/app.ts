require('dotenv').config()
import express from "express"
import path from "path"

const app = express()
app.use(express.json())
app.use(express.static('public'))

let userAPIRouter = require('./routes/userAPI');

app.use("/api/users",userAPIRouter);


// USER ENDPOINT 


const PORT = process.env.PORT || 3333;
const server = app.listen(PORT)
console.log(`Server started, listening on port: ${PORT}`)
module.exports.server = server;


