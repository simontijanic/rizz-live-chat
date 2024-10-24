const Message = require('../models/messageModel');
let users = {}; // Object to store { username: socketId }

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    const username = socket.handshake.session ? socket.handshake.session.username : undefined;
    if (!username) {
      console.log("No username in session, disconnecting");
      return socket.disconnect();
    }

    users[username] = socket.id;
    io.emit('online users', users);

    socket.on('chat message', async (data) => {
      const { message, recipient } = data;

      if (!message || typeof message !== 'string' || message.length > 200) {
        console.error('Invalid message:', message);
        return;
      }

      try {
        if (recipient && users[recipient]) {
          const privateMessage = new Message({ user: username, text: message, reciever: recipient });
          await privateMessage.save();
          console.log('Private message saved to database');

          io.to(users[recipient]).emit('chat message', { user: username, message: `(Private) ${message}` });
        } else {
          const publicMessage = new Message({ user: username, text: message, reciever: 'all' });
          await publicMessage.save();
          console.log('Public message saved to database');

          io.emit('chat message', { user: username, message });
        }
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('disconnect', () => {
      io.emit('online users', users); //skrive inn i dokumentasjonen på presentasjonen at istedet for å logge ting så har du gjort de til ekte funkjsoner på appen
      delete users[username]; 
    });
  });
};

module.exports = socketHandler;
