const socket = io();

// listener for "chat message"
socket.on('chat message', (data) => {
  console.log("Client received message");
  const messages = document.getElementById('messages');
  const li = document.createElement('li');
  li.textContent = `${data.user}: ${data.message}`;
  messages.appendChild(li);
});

document.getElementById('messageForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  if (message !== '') {
    socket.emit('chat message', { user: 'User', message });
    input.value = ''; 
  }
});
