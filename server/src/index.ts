import cors from "cors";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import keys from "./config/keys";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const users: any = {};
const socketToRoom: any = {};

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);
app.enable("trust proxy");

io.on("connection", socket => {
  socket.on("join room", roomID => {
    if (users[roomID]) {
      // const length = users[roomID].length;
      // if (length === 4) {
      //   socket.emit("room full");
      //   return;
      // }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id: any) => id !== socket.id);

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", payload => {
    io.to(payload.userToSignal).emit("user joined", { signal: payload.signal, callerID: payload.callerID });
  });

  socket.on("returning signal", payload => {
    io.to(payload.callerID).emit("receiving returned signal", { signal: payload.signal, id: socket.id });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id: any) => id !== socket.id);
      users[roomID] = room;
    }
    socket.broadcast.emit("user left", socket.id);
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Yo Man, you're there keep it up and always remember NOTHING LASTS FOREVER");
});

httpServer.listen(keys.port, () => console.log(`server is running on ${keys.port}`));
