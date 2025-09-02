import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import betRoutes from "./routes/BetRoute.js";
import { db } from "./database/db.js";
import { setSocketIO } from "./controllers/BetController.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Create HTTP server
const server = createServer(app);

// Setup Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: ["https://faizansafwan.github.io", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Make io accessible in routes
app.set("io", io);

app.use(
  cors({
    origin: ["https://faizansafwan.github.io", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/bets", betRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Ground Bet API is running...");
});

app.get("/api/ping", (req, res) => {
  res.send("pong");
});

// Start server
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);
    socket.on("disconnect", () => console.log("❌ Client disconnected:", socket.id));
  });
  
  // Make io available in controllers
  setSocketIO(io);

// MySQL connection
db.getConnection()
  .then(() => console.log("✅ MySQL connected successfully"))
  .catch((err) => console.error("❌ MySQL connection failed:", err));
