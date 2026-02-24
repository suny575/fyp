import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

socket.emit("register", userId); // send user ID after login