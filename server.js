const WebSocket = require('ws');

// Cria o servidor WebSocket
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server is running on ws://localhost:8080');

// Lista de conexões ativas
const clients = new Set();

wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.add(ws);

    // Quando uma mensagem é recebida
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // Encaminha a mensagem para todos os clientes conectados
        for (const client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    });

    // Quando a conexão é fechada
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });
});
