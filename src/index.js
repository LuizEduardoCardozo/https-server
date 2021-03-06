const express = require('express');
const app = express();
const { static } = require('express');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4 } = require('uuid');
 
app.set('view engine', 'ejs');
app.use(static('public'));

app.get('/', ( req, res )=> res.redirect(`/${v4()}`) );

app.get('/:room', ( req, res )=> res.render("room", { roomId: req.params.room }) );


io.on('connection', (socket) => {

    socket.on('join-room', (roomId, userId) => {

        socket.broadcast.emit('user-conected', userId);

    });

});


server.listen(process.env.PORT || 3001);
