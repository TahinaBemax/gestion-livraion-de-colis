import { io } from "socket.io-client";
const socket = io("http://localhost:3001", {
  query: { userId: 1 }
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("receive_notification", (data) => {
  console.log("Notification réçu:", data);
});