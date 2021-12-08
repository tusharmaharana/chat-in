import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import keys from "./config/keys";

interface Rooms {
  [roomId: string]: string[];
}

interface SocketToRoom {
  [socketID: string]: string;
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.IO_CLIENT,
    methods: ["GET", "POST"]
  }
});

const rooms: Rooms = {};
const socketToRoom: SocketToRoom = {};

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);
app.enable("trust proxy");

io.on("connection", socket => {
  socket.on("join room", roomId => {
    if (rooms[roomId]) {
      if (rooms[roomId].length === 10) {
        socket.emit("room full");
        return;
      }
      rooms[roomId].push(socket.id);
    } else {
      rooms[roomId] = [socket.id];
    }
    console.log(rooms[roomId]);
    socketToRoom[socket.id] = roomId;
    const usersInThisRoom = rooms[roomId].filter((id: string) => id !== socket.id);

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", payload => {
    io.to(payload.userToSignal).emit("user joined", { signal: payload.signal, callerID: payload.callerID });
  });

  socket.on("returning signal", payload => {
    io.to(payload.callerID).emit("receiving returned signal", { signal: payload.signal, id: socket.id });
  });

  socket.on("disconnect", () => {
    const roomId = socketToRoom[socket.id];
    let room = rooms[roomId];
    if (room) {
      room = room.filter((id: string) => id !== socket.id);
      rooms[roomId] = room;
    }
    socket.broadcast.emit("user left", socket.id);
  });
});

httpServer.listen(keys.port, () => console.log(`server is running on ${keys.port}`));
