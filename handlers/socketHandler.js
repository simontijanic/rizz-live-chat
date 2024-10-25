const Message = require('../models/messageModel');
let users = {}; // Object to store { username: socketId }

const socketHandler = (io) => {
  let users = {}; // Store users with their socket ID

  io.on('connection', (socket) => {
    const username = socket.handshake.session ? socket.handshake.session.username : undefined;
    if (!username) {
      return socket.disconnect();
    }

    users[username] = socket.id;
    io.emit('online users', users);

    socket.on('chat message', async (data) => {
      const { message, recipient } = data;

      if (!message || typeof message !== 'string' || message.length > 200) {
        return;
      }

      if (recipient && users[recipient]) {
        // Send a private message if `recipient` is specified and valid
        io.to(users[recipient]).emit('chat message', { user: username, message: `(Private) ${message}` });
      } else {
        // Send a public message to all users
        io.emit('chat message', { user: username, message });
      }
    });

    socket.on('disconnect', () => {
      delete users[username];
      io.emit('online users', users);
    });
  });
};

module.exports = socketHandler;
