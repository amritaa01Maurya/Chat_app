const express = require('express')
const mongoose = require('mongoose')
const http = require('http')
const dotenv = require('dotenv')
const cors = require('cors')
const socketIo = require('socket.io')

const authRoutes = require('./routes/auth')
const { userInfo } = require('os')
const { time, timeStamp } = require('console')

dotenv.config();
const app = express();
const server = http.createServer(app);

// middleware
app.use(cors());
app.use(express.json());

// db
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// routes
app.use('/api/auth', authRoutes);


const io = socketIo(server, {
    cors: {
        origin: "*", // allow all origins
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`)

    socket.on('join_room', (username) => {
        socket.username = username // store username in socket object
        console.log(`${username} joined the chat`)
    })

    socket.on('send_msg', (data) => {
        console.log("Server received:", data);
        io.emit('received_msg', {
            msg: data.msg,
            username: socket.username,
            timestamp: new Date().toLocaleTimeString()
        })
    })
})

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
