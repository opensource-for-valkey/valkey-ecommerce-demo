import { io } from 'socket.io-client';

// Initialize Socket connection
const socket = io('http://localhost:5000', {
  withCredentials: true,
  autoConnect: true
});

export default socket;
