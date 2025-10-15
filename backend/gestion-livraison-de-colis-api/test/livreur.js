import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  //ID SENDER OR THE CONNECTED USER
  query: { userId: 13} // ID Utilisateur: Livreur, Prestataire, Tempo One
});

// CONNECTION SOCKET
socket.on("connect", () => {
  console.log("Connected:", socket.id);

  signalerProblemeColis();
});

// NOTIFICATION RECU
socket.on("receive_notification", (data) => {
  console.log("NoReceived notification:", data);
});

function signalerProblemeColis() {
  console.log("Envoie du notification en cours");
  
  socket.emit("send_problem_colis_alert", {
    titreProbleme: "Ethiquette manquant", 
    description: "Probleme d'éthiquette", 
    idLivreur: 2, 
    idPrestataire: 1, 
    idColis: 1
  });
}