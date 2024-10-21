const socket = io();

// listener
socket.on('chat message', (data) => {
  const messages = document.getElementById('messages');
  const li = document.createElement('li');

  if (data.user === username) {
    li.className = 'my-message'; // Class for user's own messages
  } else {
    li.className = 'other-message'; // Class for others' messages
  }

    li.textContent = `${data.user}: ${data.message}`;
  messages.appendChild(li);
});

document.getElementById('messageForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  if (message !== '') {

    //server
    socket.emit('chat message', { message });
    input.value = ''; 
  }
});
