const Message = require('../models/messageModel');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
      const username = socket.handshake.session ? socket.handshake.session.username : undefined;

      if (!username) {
        console.log("No username in session, disconnecting");
        return socket.disconnect();
      }

      console.log(`${username} has joined the chat`);

      socket.on('chat message', async (data) => {
        console.log('Chat:', data);
        try {
          const message = new Message({ user: username, text: data.message });
          await message.save();
          console.log('Message saved to database');
  
          io.emit('chat message', { user: username, message: data.message });
          } catch (err) {
          console.error(err);
        }
      });
  
      socket.on('disconnect', () => {
        console.log(`${username} disconnected`);
      });
  
    })
};

module.exports = socketHandler;
