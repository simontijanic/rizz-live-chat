const Message = require('../models/messageModel');
let users = {}; 

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    const username = socket.handshake.session ? socket.handshake.session.username : undefined; // henter brukernavnet fra socket.handshake.session hvis det finnes eller så settes username til undefined
    console.log(`Socket handshake session:`, socket.handshake.session); // ?: Hvis sesjonen finnes og : hvis ikke

    if (!username) {
      return socket.disconnect();
    }

    socket.username = username;
    users[username] = socket.id;

    io.emit('online users', users);

    socket.on('chat message', async (data) => {
      const { message, recipient } = data;

      if (!message || typeof message !== 'string' || message.length > 200) {
        return;
      }

      if (recipient && users[recipient]) {
        io.to(users[recipient]).emit('chat message', { user: username, message: `(Private) ${message}` });
      } else {
        io.emit('chat message', { user: username, message });
      }
    });

    socket.on('disconnect', () => {
      if (socket.username) {
        delete users[socket.username];
        io.emit('online users', users);
      }
    });
  });
};

module.exports = socketHandler;
