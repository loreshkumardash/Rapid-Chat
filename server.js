const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app); //Server is created
const io = require("socket.io")(server);
//var audio=new Audio('ting.mp3');
app.use(express.static(path.resolve("./public")));//Path is created
app.set(express.static(path.join(__dirname + "./public"))); //path gives request
app.get("/", (req, res) => {
    return res.sendFile("/public/index.html"); ///Server Request and Responce
});
io.on("connection", function (socket) {
    socket.on("newuser", function (username) {
        socket.broadcast.emit("update", username + "Joined the conversation"); //For joining Newuser
    });
    socket.on("exituser", function (username) {
        socket.broadcast.emit("update", username + " left the conversation");  //For exit the User
    });
    socket.on("chat",function(message){
        socket.broadcast.emit("chat",message);  //For Chatiing
    });
});

server.listen(3800);  //server localhost calling