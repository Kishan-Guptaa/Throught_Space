// import { io, Socket } from "socket.io-client";

// const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// let socket: Socket;

export const getSocket = (userId?: string) => {
  /*
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false
    });
  }

  if (userId && !socket.connected) {
    socket.connect();
    socket.emit("join", userId);
  }

  return socket;
  */
  return { on: () => {}, off: () => {}, emit: () => {}, connected: false } as any;
};

export const disconnectSocket = () => {
  /*
  if (socket) {
    socket.disconnect();
  }
  */
};
