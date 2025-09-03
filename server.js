const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3800;

app.use(express.static(path.join(__dirname, "public")));

// Serve the main HTML file
app.get("/", (req, res) => {
    // Use path.join to create a safe, cross-platform file path
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Socket.IO event handling
io.on("connection", (socket) => {
    socket.on("newuser", (username) => {
        // Using template literals for cleaner string formatting
        socket.broadcast.emit("update", `${username} has joined the conversation`);
    });

    socket.on("exituser", (username) => {
        socket.broadcast.emit("update", `${username} has left the conversation`);
    });

    socket.on("chat", (message) => {
        // Forward the entire message object to other clients
        socket.broadcast.emit("chat", message);
    });
});

// Start the server and listen on the specified port
server.listen(PORT)
    .on("error", (err) => {
        // Gracefully handle common errors, like the port being in use
        if (err.code === "EADDRINUSE") {
            console.error(`❌ Port ${PORT} is already in use.`);
            console.error(`💡 Please stop the running process or change the port.`);
            process.exit(1); // Exit to avoid silent failure
        } else {
            // For any other errors, log them and exit
            throw err;
        }
    })
    .on("listening", () => {
        // Confirm that the server has started successfully
        console.log(`✅ Server is running at http://localhost:${PORT}`);
    });