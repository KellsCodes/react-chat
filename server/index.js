const express = require("express");
const app = express()
const socket = require("socket.io")

const cors = require("cors");

app.use(cors());
app.use(express.json())

const PORT = process.env.PORT || 8080;


const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`)
})

const io = socket(server);
io.on("connection", (socket) => {
    // console.log(socket.id)
    console.log("user connected")

    socket.on("join_room", (data) => {
        socket.join(data)
        console.log('user joined room: ' + data)
    })

    socket.on("disconnect", ()=> {
        console.log("user disconnected")
    })
})