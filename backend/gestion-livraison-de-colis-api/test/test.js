import { io } from "socket.io-client";
const socket = io("http://localhost:3000", {
  query: { userId: 4 }
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  sendNotification();
});

socket.on("receive_notification", (data) => {
  console.log("Notification:", data);
});

function sendNotification() {
  socket.emit("send_alert", {
    from: 4,
    receiverUserType: "TYPE-USER-00002",
    idReceiver: 1,
    titre: "Test",
    message: "Hello, you have a new alert!",
  });
}