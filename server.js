const WebSocket = require('ws');
const fs = require('fs');
const https = require('https');

// Carrega os certificados SSL/TLS
const server = https.createServer({
    cert: fs.readFileSync('/etc/letsencrypt/live/ws.area33.chat/fullchain.pem'), // Substitua pelo caminho do certificado
    key: fs.readFileSync('/etc/letsencrypt/live/ws.area33.chat/privkey.pem')   // Substitua pelo caminho da chave privada
});

// Cria o servidor WebSocket seguro
const wss = new WebSocket.Server({ server });

console.log('WebSocket server is running on wss://localhost:8765');

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

server.listen(8765, () => {
    console.log('HTTPS server is running on port 8765');
});
