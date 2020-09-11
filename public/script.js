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

    RoomPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (newUserStream) => {
        addVideoStream(video, newUserStream);
      });
    });

    socket.on("new-user-joined", (user) => {
      connectNewUser(user, stream);
    });
  })
  .catch((err) => console.log(err));

RoomPeer.on("open", (id) => {
  socket.emit("join-video-chat", ROOM_ID, id);
});

function connectNewUser(user, stream) {
  const call = RoomPeer.call(user, stream);
  const video = document.createElement("video");
  call.on("stream", (newUserStream) => {
    addVideoStream(video, newUserStream);
  });
  call.on("close", () => {
    video.remove();
  });
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  videoGrid.append(video);
}
