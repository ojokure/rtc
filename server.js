const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-video-chat", (roomId, user) => {
    // console.log(user, roomId);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("new-user-joined", user);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-left", user);
    });
  });
});

server.listen(3030);
