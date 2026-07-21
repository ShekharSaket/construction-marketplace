const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const app = express();
connectDB();

app.use(cors({
    origin: ["http://localhost:3000", "https://construction-marketplace-sepia.vercel.app"],
    credentials: true
}));
app.use(express.json());

const server = http.createServer(app);

// 1. Initialize Socket.IO FIRST
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// 2. EXPORT `io` IMMEDIATELY (This fixes the circular dependency warning)
module.exports = { io };

// 3. NOW require the routes (They can safely import `io` from server.js now)
const authRoutes = require("./routes/authRoutes");
const workerRoutes = require("./routes/workerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Construction Marketplace Backend Running");
});

// 4. Setup Socket Events
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Customer joins a specific worker's tracking room
  socket.on("join-tracking", (workerId) => {
    socket.join(`tracking_${workerId}`);
    console.log(`Socket ${socket.id} joined room: tracking_${workerId}`);
  });

  // Worker emits location -> Broadcast ONLY to the specific room
  socket.on("worker-location", (data) => {
    io.to(`tracking_${data.workerId}`).emit("live-location", data);
  });

  // Worker comes online
  socket.on("worker-online", async (worker) => {
    console.log("Worker Online:", worker.workerId);
    try {
      await User.findByIdAndUpdate(worker.workerId, { isOnline: true });
      io.emit("worker-status", worker);
    } catch (error) {
      console.log("Error updating worker status:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// 5. Start the server
server.listen(5000, () => {
  console.log("Server running on port 5000");
});