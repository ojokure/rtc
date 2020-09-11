const socket = io("/");

const RoomPeer = new Peer(null, {
  host: "/",
  port: "3031",
});

RoomPeer.on("open", (id) => {
  socket.emit("join-video-chat", ROOM_ID, id);
});

socket.on("new-user-joined", (userId) => {
  console.log("new user connected", userId);
});
