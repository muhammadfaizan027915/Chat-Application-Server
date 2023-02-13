const socket = require("socket.io");
const Messages = require("../Models/Messages");

const newClient = (clients, userId, socketId) => {
  return [...clients, { userId, socketId }];
};

const removeClient = (clients, socketId) => {
  return clients.filter((client) => client.socketId !== socketId);
};

exports.scoketServer = (app, options, eventsEmitter) => {
  const io = new socket.Server(app, { cors: options });

  let clients = [];

  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      clients = newClient(clients, userId, socket.id);
      io.emit("active", clients);
    });

    socket.on("updatestatus", (...args) => {
      eventsEmitter.emit("updatestatus", args[0], args[1])
    })

    socket.on("logout", () => {
      socket.disconnect();
    });

    socket.on("disconnect", () => {
      clients = removeClient(clients, socket.id);
      io.emit("active", clients);
    });
  });

  eventsEmitter.on("sendmessage", (...args) => {
    const reciever = clients.find((client) => client.userId === args[1]);
    io.to(reciever?.socketId).emit("sendmessage", args[0]);
  });

  eventsEmitter.on("updatestatus", (...args) => {
    Messages.updateMany(
      { conversationId: args[0], sender: args[1], seen: false },
      { seen: true },
      { new: true },
      (err, res) => {
        if (err) return;
        const sender = clients.find((client) => client.userId === args[1]);
        if(res.modifiedCount > 0)
          io.to(sender?.socketId).emit("updatestatus", args[1]);
      }
    );
  });
};
