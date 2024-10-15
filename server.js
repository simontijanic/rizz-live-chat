const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;
server.listen(PORT);

// -------------------- Chat App ----------------------------------

const Message = require('./models/messageModel');

io.on('connection', (socket) => {
  console.log('Bruker er tilkoblet:', socket.id);

  socket.on('chat message', async (data) => {
    console.log('Melding:', data);
  
    //lagre melding til databasen
    const message = new Message({ user: data.user, text: data.message });
    try {
      await message.save();
      console.log('Message saved to the database');
    } catch (err) {
      console.error('Error saving message to database:', err);
    }
  
    io.emit('melding til alle', data); //broadcasta til alle sammen
  });

  socket.on('disconnect', () => { //bruker disconnecta
    console.log('User disconnected:', socket.id);
  });
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', UserSchema);

app.set(`view engine`, `ejs`);
app.use(`views`, express.static('views'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});