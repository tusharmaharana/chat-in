import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import keys from "./config/keys";

interface Rooms {
  [roomID: string]: string[];
}

interface SocketToRoom {
  [socketID: string]: string;
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
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
  socket.on("join room", roomID => {
    if (rooms[roomID]) {
      if (rooms[roomID].length === 10) {
        socket.emit("room full");
        return;
      }
      rooms[roomID].push(socket.id);
    } else {
      rooms[roomID] = [socket.id];
    }
    console.log(rooms[roomID]);
    socketToRoom[socket.id] = roomID;
    const roomsInThisRoom = rooms[roomID].filter((id: string) => id !== socket.id);

    socket.emit("all rooms", roomsInThisRoom);
  });

  socket.on("sending signal", payload => {
    io.to(payload.userToSignal).emit("user joined", { signal: payload.signal, callerID: payload.callerID });
  });

  socket.on("returning signal", payload => {
    io.to(payload.callerID).emit("receiving returned signal", { signal: payload.signal, id: socket.id });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = rooms[roomID];
    if (room) {
      room = room.filter((id: string) => id !== socket.id);
      rooms[roomID] = room;
    }
    socket.broadcast.emit("user left", socket.id);
  });
});

httpServer.listen(keys.port, () => console.log(`server is running on ${keys.port}`));
