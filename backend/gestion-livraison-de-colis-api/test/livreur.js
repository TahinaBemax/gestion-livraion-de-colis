import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  //ID SENDER OR THE CONNECTED USER
  query: { userId: 6 } // ID Utilisateur: Livreur, Prestataire, Tempo One
});

// CONNECTION SOCKET
socket.on("connect", () => {
  console.log("Connected:", socket.id);

  sendNotification();
});

// NOTIFICATION RECU
socket.on("receive_notification", (data) => {
  console.log("Notification:", data);
});

function sendNotification() {
  socket.emit("send_alert", {
    receiverUserType: ["TYPE-USER-00002", "TYPE-USER-00001"], //ID du type de l'utilisateur destinateur(Prestataire, TempoOne, Livreur) 
    idReceiver: 1, // ID de l'utilisateur destinateur (ID Prestataire, ID Livreur)
    titre: "Livreur Temporaire", //Titre du message
    message: "Le liveur ID: 4 a crée un livreur temporaire!", // Detail
  });
}