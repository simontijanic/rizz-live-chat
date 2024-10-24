const socket = io();

// ---------------------- LISTENERS ----------------- //
socket.on('chat message', (data) => {
  const messages = document.getElementById('messages');
  const li = document.createElement('li');

  if (data.user === username) {
    li.className = 'my-message';
  } else {
    li.className = 'other-message';
  }

  const messageText = data.message.startsWith('(Private)') ? `<em>${data.message}</em>` : data.message;
  
  li.innerHTML = `<strong>${data.user}:</strong> ${messageText}`;
  messages.appendChild(li);
});

socket.on('online users', (users) => {
  const userList = document.getElementById('onlineUsers');
  userList.innerHTML = '';  

  for (const username in users) {
      const li = document.createElement('li');
      li.textContent = `${username} (ID: ${users[username]})`; // Display username and socket ID
      userList.appendChild(li);
  }
});

// ---------------------- ANNET ----------------- //

document.getElementById('messageForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('messageInput');
  const errorMessage = document.getElementById(`errorMessage`)
  const message = input.value.trim();

  if (message === '') {
    console.error('Message cannot be empty!');
    errorMessage.innerHTML = 'Message cannot be empty!';
    return;
  }

  if (message.length > 200) {
    console.error('Message cannot exceed 200 characters!');
    errorMessage.innerHTML = 'Message cannot exceed 200 characters!';
    return;
  }

  // Detect if the message starts with @username
  let recipient = null;
  const regex = /^@(\w+)/; // Regex to detect @username
  const match = message.match(regex);

  if (match) {
    recipient = match[1]; // Extract username after @
  }

  // Emit the message along with the recipient to the server
  socket.emit('chat message', { user: username, message, recipient });
  
  input.value = ''; 
  errorMessage.innerHTML = '';
});
