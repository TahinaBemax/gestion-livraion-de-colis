import { io } from "socket.io-client";
const socket = io("http://localhost:4000", {
  query: { userId: 6 }
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  //sendNotification();
});

socket.on("receive_notification", (data) => {
  console.log("Notification:", data);
});

function sendNotification() {
  socket.emit("send_alert", {
    receiverUserType: "TYPE-USER-00002", //Type de l'utilisateur (Prestataire)
    idReceiver: 1, // ID de l'utilisateur destinateur (ID Prestataire, ID Livreur)
    titre: "Test",
    message: "Hello, you have a new alert!",
  });
}