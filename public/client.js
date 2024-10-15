const socket = io();

socket.on('chat message', (data) => {
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
