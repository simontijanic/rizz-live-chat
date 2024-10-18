const Message = require('../models/messageModel');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('chat message', async (data) => {
      console.log('Chat:', data);
      try {
        const message = new Message({ user: data.user, text: data.message });
        await message.save();
        console.log('Message saved to database');

        io.emit('chat message', data); 
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
