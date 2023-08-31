const WebSocket = require('ws');
const MongoClient = require('mongodb').MongoClient;

const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (socket) => {
    console.log('Client connected');
    
    socket.on('message', (json) => {
        const obj = JSON.parse(json);

        console.log(obj.data);
        insertMongoDb(obj.data);

        socket.send(obj.message);
    });

    socket.on('close', () => {
        console.log('Client disconnected');
    });
});

async function insertMongoDb(data) {
    const uri = 'mongodb+srv://dgarcia7dev:JRwbMrOAbksbYwgY@cluster0-double-v-partn.gu0pvea.mongodb.net/?retryWrites=true&w=majority';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('node-double-v-partners');
        const collection = db.collection('notifications');

        await collection.insertOne(data);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
    }
}

console.log('WebSocket server listening...');