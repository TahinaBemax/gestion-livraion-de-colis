import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  //ID SENDER OR THE CONNECTED USER
  query: { userId: 13} // ID Utilisateur: Livreur, Prestataire, Tempo One
});

// CONNECTION SOCKET
socket.on("connect", () => {
  console.log("Connected:", socket.id);

  signalerProblemeLivraison();
});

// NOTIFICATION RECU
socket.on("receive_notification", (data) => {
  console.log("++++ Received notification ++++\n", data);
  console.log("++++ +++++ ++++\n", data);
});

function signalerProblemeLivraison() {
  console.log("Envoie du notification en cours");
  
  socket.emit("send_problem_livraison_alert", {
    titreProbleme: "Embouitaillage", 
    description: "Un camion en panne et bloque la rue", 
    idLivreur: 2, 
    idPrestataire: 1, 
    idColis: 2,
    idLivraison: 1,
    estimationRestard: "00:30"
  });

  console.log("Envoyé avec succés");
}