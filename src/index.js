const express = require('express'); 
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const app = express();

const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket)=> {
    console.log('A new player connected ');
})

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});