import { io } from "socket.io-client";
const socket = io("http://localhost:3000", {
  query: { userId: 6 }
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  sendNotification();
});

socket.on("receive_notification", (data) => {
  console.log("Notification:", data);
});

function sendNotification() {
  socket.emit("send_alert_from_tempoOne_to_prestataire", {
    titreProbleme: "Preuve de livraison manquante", 
    description: "Vous n'avez pas fourni de preuve de livraison pour le colis #12345.", 
    idPrestataire: 1, 
    idUtilisateur: 5,
  });
}