const mongoose = require("mongoose");
const expresss = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const routes = require("./Routes/index");
const socket = require("./Socket");
const Emitter = require("events");
const http = require("http");
const app = expresss();

// Configurations
const options = {
  origin: "http://localhost:3000",
  methods: ["GET", "PUT", "POST", "DELETE"],
  credentials: true,
};
app.use(cors(options));

app.use(
  session({
    secret: "Secret",
    name: "session",
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: false,
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      path: "/",
    },
  })
);

app.use([morgan("tiny"), expresss.json(), cookieParser()]);

// Events emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

// Routes
app.use([routes.messages, routes.user]);

mongoose
  .connect(
    "mongodb+srv://faizan027915:faizan027915@mern.jsr5rzh.mongodb.net/?retryWrites=true&w=majority",
    {
      autoIndex: false,
      dbName: "ChatApplication",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    }
  )
  .then(() => console.log("Connected to the database..."))
  .catch((err) => console.log("Failed to connect to the database...", err));

// PORT for listening server
const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
// Listening the server
server.listen(PORT, () => {
  console.log(`Server is listening at port: ${PORT}`);
  socket.scoketServer(server, options, eventEmitter);
});
