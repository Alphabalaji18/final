import express from "express";
import http from "http";
import { Server } from "socket.io";
import agoraAccessToken from "agora-access-token";

const { RtcTokenBuilder, RtcRole } = agoraAccessToken;

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

const waitingUsers = [];
const userSocketMap = {}; // { userId: socketId }

// Function to get receiver socket ID - removed the export here
function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

function generateToken(channelName, uid) {
  const role = RtcRole.PUBLISHER;
  const expireTime = 3600;
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

  return RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpireTime
  );
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Track user's socket ID when they connect with their user ID
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("randomCall", () => {
    if (waitingUsers.length > 0) {
      const partnerSocketId = waitingUsers.shift();
      const channelName = `call_${Date.now()}`;
      
      const token1 = generateToken(channelName, socket.id);
      const token2 = generateToken(channelName, partnerSocketId);

      socket.emit("callMatched", { 
        channelName, 
        token: token1,
        uid: socket.id,
        partnerId: partnerSocketId
      });

      io.to(partnerSocketId).emit("callMatched", { 
        channelName, 
        token: token2,
        uid: partnerSocketId,
        partnerId: socket.id
      });
    } else {
      waitingUsers.push(socket.id);
    }
  });
  socket.on("endCall", ({ partnerId }) => {
    // Notify both parties that the call ended
    socket.emit("callEnded", { initiator: true });
    if (partnerId) {
      io.to(partnerId).emit("callEnded", { initiator: false });
    }
    console.log(`Call ended between ${socket.id} and ${partnerId}`);
  });

  socket.on("disconnect", () => {
    // Remove from waiting queue
    const index = waitingUsers.indexOf(socket.id);
    if (index !== -1) waitingUsers.splice(index, 1);
    
    // Remove from online user map
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
    
    console.log("User disconnected:", socket.id);
  });
});

// Single export statement at the bottom
export { app, server, io, getReceiverSocketId };