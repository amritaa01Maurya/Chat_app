const express = require('express')
const mongoose = require('mongoose')
const http = require('http')
const dotenv = require('dotenv')
const cors = require('cors')
const socketIo = require('socket.io')

const authRoutes = require('./routes/auth')

const messageRoutes = require('./routes/message')
const Message = require('./models/Message')

dotenv.config();
const app = express();
const server = http.createServer(app);

// middleware
// app.use(cors());
app.use(cors({
    origin: "*",  // Allow all origins
    credentials: true
}));

app.use(express.json());

// db
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// routes
app.use('/api/auth', authRoutes);

// to get chat history
app.use('/api/messages', messageRoutes)
  


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

    // save to db before emitting
    socket.on('send_msg', async (data) => {
        try {
            const newMessage = new Message({
                username: data.username,
                msg: data.msg,
                time: data.time
            });

            // save to db
            const savedMessage = await newMessage.save();
        
            // console.log("Server received:", data);
            io.emit('received_msg', savedMessage) // broadcast the saved msg to all clients
        } catch (err) {
            console.error("Error saving message:", err);
        }
    })
})

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
