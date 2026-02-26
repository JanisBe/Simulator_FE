const WebSocket = require('ws');

// Create a WebSocket server listening on port 8080
const server = new WebSocket.Server({ port: 8080 });

// Array to keep track of connected clients
let clients = [];

// Function to send messages at 1-second intervals
function sendMessages(socket) {
  let count = 0;
  const intervalId = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      const messageBody = {
        payload: '1234=testpayload',
        id: count,
        type: 'OINP',
        transactionId: count,
      };

      //const message = JSON.stringify({ message: `Message ${count}` });

      const message = JSON.stringify(messageBody);

      socket.send(message);
      count++;
    } else {
      clearInterval(intervalId);
    }
  }, 5000);
}

// Handle new connections
server.on('connection', socket => {
  clients.push(socket);
  console.log('Client connected');

  // Start sending messages at 1-second intervals
  sendMessages(socket);

  // Handle incoming messages
  socket.on('message', message => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log('Received:', parsedMessage);

      // Broadcast the message to all connected clients
      clients.forEach(client => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (e) {
      console.error('Invalid JSON:', e);
    }
  });

  // Handle client disconnections
  socket.on('close', () => {
    clients = clients.filter(client => client !== socket);
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
