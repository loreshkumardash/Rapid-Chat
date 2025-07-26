const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let PORT = process.env.PORT || 3802;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Serve the main HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Socket.IO event handling
io.on("connection", (socket) => {
    socket.on("newuser", (username) => {
        socket.broadcast.emit("update", `${username} has joined the conversation`);
    });

    socket.on("exituser", (username) => {
        socket.broadcast.emit("update", `${username} has left the conversation`);
    });

    socket.on("chat", (message) => {
        socket.broadcast.emit("chat", message);
    });
});

// Handle port in use error gracefully
server.listen(PORT)
    .on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`❌ Port ${PORT} is already in use.`);
            console.error(`💡 Please stop the running process or change the port.`);
            process.exit(1); // Exit to avoid silent failure
        } else {
            throw err;
        }
    })
    .on("listening", () => {
        console.log(`✅ Server is running at http://localhost:${PORT}`);
    });
