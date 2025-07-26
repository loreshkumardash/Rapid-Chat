const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 3801;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    // Use path.join to create a correct, cross-platform path
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", function (socket) {
    socket.on("newuser", function (username) {
        socket.broadcast.emit("update", username + " has joined the conversation");
    });
    socket.on("exituser", function (username) {
        socket.broadcast.emit("update", username + " has left the conversation");
    });
    socket.on("chat",function(message){
        socket.broadcast.emit("chat",message);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});