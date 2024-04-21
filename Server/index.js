import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log(`
  User connected `);
  console.log("ID", socket.id);
  socket.emit("welcome", `Welcome to server! ${socket.id}`);

  socket.on("message", ({ messageInput, room }) => {
    console.log(messageInput, room, "message");
    socket.to(room).emit("receive-message", messageInput);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`user join! ${room}`);
  });

  socket.on("disconnect", () => {
    console.log(`
    User disconnected `);
    console.log("ID", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
