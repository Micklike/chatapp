import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRouter from "./routes/authroutes.js"
import cookieParser from "cookie-parser"
import messageRouter from "./routes/messageroutes.js"
import { Server } from "socket.io"
import http from "http"

dotenv.config()

const app = express()
const server = http.createServer(app) // Create server

// Initialize socket.io on top of HTTP server
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

// Store online users
export const userSocketMap = {} // userId -> socketId

// Socket connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("user connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit list of online users
  io.emit("getOnlineUser", Object.keys(userSocketMap));

  /**
   * New Message event
   */
  socket.on("newMessage", async (newMessage) => {
    try {
      const { receiverId } = newMessage;

      // Find recipient socket
      const receiverSocketId = userSocketMap[receiverId];

      if (receiverSocketId) {
        // Send the message to the recipient
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      // Optional: if you want to update "seen" status on the backend:
      // if recipient is online and selected the same chat, mark as seen
      // Example: (requires message model)
      /*
      await Message.findByIdAndUpdate(newMessage._id, {
        seen: !!receiverSocketId,
      });
      */

    } catch (err) {
      console.log("Error in newMessage socket:", err);
    }
  });

  /**
   * Disconnect event
   */
  socket.on("disconnect", () => {
    console.log("user disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUser", Object.keys(userSocketMap));
  });
});


// Middlewares
app.use(express.json({ limit: "4mb" }))
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}))
app.use(cookieParser())

app.get("/", async (req, res) => {
  res.json({ message: "can communicate" })
})

// Routes
app.use("/api/auth/", authRouter)
app.use("/api/messages/", messageRouter)

// MongoDB connect
async function connectdb() {
  await mongoose.connect(`${process.env.MONGO_URL}chatapp?retryWrites=true&w=majority`)
  console.log("db connected")
}

// Start server
server.listen(process.env.PORT || 5000, () => {
  console.log("server is running")
  connectdb()
})
