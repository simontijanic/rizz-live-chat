const express = require('express');
const socketIO = require('socket.io');
const { connectDB } = require('./handlers/dbHandler');
const routes = require('./routes/default'); 
const socketHandler = require('./handlers/socketHandler');

const app = express();
const PORT = 3000;

connectDB();

// middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views', __dirname + '/views');

app.use('/', routes);

// start servern
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const io = socketIO(server);

// socket io handleren
socketHandler(io);
