const socket = io();

socket.on('chat message', (data) => {
  const messages = document.getElementById('messages');
  const li = document.createElement('li');

  const isPrivateMessage = data.recipient && data.recipient !== username;   // sjeker om meldingen er en privat

  if (data.user === username || !isPrivateMessage) {
      li.className = 'my-message';
  } else {
      li.className = 'other-message';
  }

  const messageText = isPrivateMessage 
      ? `<em>(Private) ${data.message}</em>` 
      : data.message;
  
  li.innerHTML = `<strong>${data.user}:</strong> ${messageText}`;
  messages.appendChild(li);
});


socket.on('online users', (users) => {
  const userList = document.getElementById('onlineUsers');
  userList.innerHTML = '';  

  for (const username in users) {
      const li = document.createElement('li');
      li.textContent = `${username} (ID: ${users[username]})`;
      userList.appendChild(li);
  }
});


document.getElementById('messageForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const input = document.getElementById('messageInput');
  const errorMessage = document.getElementById(`errorMessage`);
  let message = input.value.trim();

  if (message === '') {
    errorMessage.innerHTML = 'Meldingen må inneholde tekst!';
    return;
  }

  if (message.length > 200) {
    errorMessage.innerHTML = 'Meldingen kan ikke være større enn 200 bokstaver!';
    return;
  }

  let recipient = null;
  const regex = /^@([\w.-]+)/;
  const match = message.match(regex);

  if (match) {
    recipient = match[1]; // får usernamer etter  @
    message = message.replace(regex, '').trim(); // fjerner @username fra messagen
  }

  socket.emit('chat message', { user: username, message, recipient });

  input.value = ''; 
  errorMessage.innerHTML = '';
});
