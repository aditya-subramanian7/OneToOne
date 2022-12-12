const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 1000;

io.on("connection", (socket) => {
  console.log("A user has connected");

  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    console.log("A user has disconnected");
  });

  socket.on("make-call", (data) => {
    io.to(data.userToCall).emit("make-call", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answer-call", (data) => {
    io.to(data.to).emit("answer-call", data.signal);
  });

  socket.on("join-room",()=>{
    console.log(socket.id+" has joined the chat")
  })
});

server.listen(PORT, () => {
  console.log("Server listening on port");
});
