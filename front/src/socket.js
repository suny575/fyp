import { io } from "socket.io-client";

// create a single socket instance
const socket = io("https://fyp-dle0.onrender.com", {
  transports: ["websocket", "polling"],
  autoConnect: false,
});

// function to join the user-specific room
export const connectSocket = (userId) => {
  if (!socket.connected) socket.connect();
  socket.emit("join", userId);
};

export default socket;

