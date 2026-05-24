const socketIo = require('socket.io');

let io;

const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Send a welcome message
    socket.emit('message', { type: 'system', text: 'Connected to Valkey Live Engine' });

    // Handle joining specific rooms (e.g., product page to get live viewers)
    socket.on('join_product_room', (productId) => {
        socket.join(`product:${productId}`);
        // Increment live viewer count and broadcast
        const roomSize = io.sockets.adapter.rooms.get(`product:${productId}`)?.size || 0;
        io.to(`product:${productId}`).emit('live_viewers_update', { productId, count: roomSize });
    });

    socket.on('leave_product_room', (productId) => {
        socket.leave(`product:${productId}`);
        const roomSize = io.sockets.adapter.rooms.get(`product:${productId}`)?.size || 0;
        io.to(`product:${productId}`).emit('live_viewers_update', { productId, count: roomSize });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      // We would ideally clean up live viewer counts here if needed
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIo };
