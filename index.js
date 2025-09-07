const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app) // request listner
// server is made with http but listening with app
const path = require('path');
const socketio = require('socket.io');
const io = socketio(server) // it is an object


const users = {}
// io.on() -> accept the event -> connection b/w client and server
// http://localhost:3000/socket.io/socket.io.js  -> this gives client side file which is provided by server
// now our client is connected to the server -> pipeline is establised -> every pipeline has a unique id


// for static file use
app.use('/',express.static(path.join(__dirname, 'public')))

// 'connection' is user defined
io.on('connection', (socket)=>{
    console.log(`connection establised at ${socket.id}`);
    // after connection this will be displayrd in the terminal

    socket.on('send-msg',(data)=>{  // listen to some event
        // console.log(data.msg);
        // socket.emit('received-msg', {   // notify to received msg
        io.emit('received-msg',{     // isse dono party ek sath baat kr payenge face to face 9means
            msg: data.msg,
            id: socket.id,
            username: users[socket.id]
        })   
    })
    socket.on('login',(data)=>{
        // console.log(data);
        users[socket.id] = data.username;// mapping the socket id with username
    })
})
// to establised the connect do in console
// first check if connection establised on not
// io -> socket {connected: false, recovered: false, receiveBuffer: Array(0), sendBuffer: Array(0), _queue: Array(0), …}
// let socket = io()   -> to connect
// socket -> Socket {connected: true, recovered: undefined, receiveBuffer: Array(0), sendBuffer: Array(0), _queue: Array(0), …}
// socket.id -> 'sralDtVlTWV8F4HeAAAD'

const port = process.env.PORT || 3000

server.listen(port, ()=>{
    console.log(`server connected at ${port}`);
})