require('dotenv').config();
const express = require('express');
const session = require('express-session');
const socketIO = require('socket.io');
const sharedSession = require('socket.io-express-session');
const { connectDB } = require('./handlers/dbHandler');
const routes = require('./routes/default');
const socketHandler = require('./handlers/socketHandler');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB(process.env.MONGODB_URI);

// middleware
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
});

app.use(sessionMiddleware);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(routes);

app.use((req, res, next) => {
  res.status(404).render('404'); 
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const io = socketIO(server, {
  connectionStateRecovery: {},
});

io.use(sharedSession(sessionMiddleware, {
  autoSave: true,
}));

socketHandler(io);
