import { io } from "socket.io-client";
const socket = io("http://localhost:4000", {
  query: { userId: 1 }
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("receive_notification", (data) => {
  console.log("Notification réçu:", data);
});

function sendNotification() {
  socket.emit("send_alert", {
    receiverUserType: "TYPE-USER-00002", //prestataire
    idReceiver: 1,
    titre: "Test",
    message: "Hello, you have a new alert!",
  });
}