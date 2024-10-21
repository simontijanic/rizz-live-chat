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

  li.innerHTML = `<strong>${data.user}:</strong> ${data.message}`; // Use innerHTML to render HTML    
  messages.appendChild(li);
});

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

  input.placeholder = '';
  socket.emit('chat message', { user: username, message });
  input.value = ''; 
  errorMessage.innerHTML = '';

  input.addEventListener('input', () => {
    input.placeholder = ''; // Clear the placeholder when user starts typing
    errorMessage.innerHTML = '';
  });  
});