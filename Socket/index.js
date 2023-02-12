const socket = require("socket.io");

const newClient = (clients, userId, socketId) => {
  return [...clients, { userId, socketId }]
};

const removeClient = (clients, socketId) => {
  return clients.filter((client) => client.socketId !== socketId);
};

exports.scoketServer = (app, options) => {
  const io = new socket.Server(app, { cors: options });

  let clients = [];

  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      clients = newClient(clients, userId, socket.id);
      io.emit("active", clients);
    });

    socket.on("logout", () => {
      socket.disconnect();
    });

    socket.on("disconnect", () => {
      clients = removeClient(clients, socket.id);
      io.emit("active", clients);
    });
  });
};
