const socket = io("/");
const videoGrid = document.getElementById("video-grid");

const RoomPeer = new Peer(null, {
  host: "/",
  port: "3031",
});

const videoChat = document.createElement("video");
videoChat.muted = true;

let constraints = {
  video: true,
  audio: true,
};

navigator.mediaDevices
  .getUserMedia(constraints)
  .then((stream) => {
    addVideoStream(videoChat, stream);
  })
  .catch((err) => console.log(err));

RoomPeer.on("open", (id) => {
  socket.emit("join-video-chat", ROOM_ID, id);
});

socket.on("new-user-joined", (userId) => {
  console.log("new user connected", userId);
});

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  videoGrid.append(video);
}
