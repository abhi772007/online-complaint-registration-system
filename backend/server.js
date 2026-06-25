const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const path = require('path');
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config({ path: path.join(__dirname, '.env') });

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(morgan("dev"));
app.use(express.json());

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", (messageData) => {
    const { roomId, sender, message } = messageData;
    io.to(roomId).emit("receiveMessage", {
      sender,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const testRoutes = require("./routes/testRoutes");
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const agentRoutes = require("./routes/agentRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

app.use(testRoutes);
app.use(userRoutes);
app.use(complaintRoutes);
app.use(agentRoutes);
app.use(feedbackRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/about", (req, res) => {
  res.send("This is Online Complaint Registration System");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});