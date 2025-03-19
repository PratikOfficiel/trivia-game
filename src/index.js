const express = require('express'); 
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const formatMessage = require('../utils/formatMessages.js')
const {
  addPlayer,
  removePlayer,
  getPlayer,
  getAllPlayers
} = require('../utils/player.js')

const app = express();

const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

io.on('connection', socket => {

    console.log('A new player connected ');

    socket.on("join", ({playerName, room},callback)=> {

      const {error, newPlayer} = addPlayer({id:socket.id, playerName, room});

      if (error) return callback(error.message);
      callback();

      socket.join(newPlayer.room);

      socket.emit("message", formatMessage("Admin", "Welcome!"))

      socket.broadcast
      .to(newPlayer.room)
      .emit("message", formatMessage("Admin", `${newPlayer.name} has joined the game`))

      io.in(newPlayer.room).emit("room",{
        room: newPlayer.room,
        players: getAllPlayers(newPlayer.room)
      })
    })

    socket.on("disconnect", ()=>{
      console.log("A player disconnected");

      const disconnectedPlayer = removePlayer(socket.id);

      if (disconnectedPlayer) {

        const {name, room} = disconnectedPlayer;
        io.in(room).emit("message", formatMessage("Admin", `${name} has left!`))

        io.in(room).emit("room", {
          room,
          players : getAllPlayers(room)
        })
      }
    })

    socket.on("sendMessage",(message, callback)=>{

      const {error, player} = getPlayer(socket.id)

      if(error){
        return callback(error.message);
      }

      if(player) {
        io.to(player.room).emit("message",formatMessage(player.name, message))
        callback();
      }

    })
})

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});