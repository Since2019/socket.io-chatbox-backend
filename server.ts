
import express, { Request, Response } from 'express';

import {
    ServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents,
    SocketData,
    SocketIoServer,

    Socket
} from "./utils/SocketIoServer"

import cors from 'cors'

const app = express();

const allowedOrigins = ['*'];
const options: cors.CorsOptions = {
    origin: allowedOrigins
};

app.use(cors(options));


const server = require('http').Server(app);
const port = 3000;

const io = new SocketIoServer(server);

io.on('connection', (socket: Socket) => {

    console.log("incoming socket connection, id:", socket.id);


    socket.on('user-name', (name) => {
        console.log("user ", name, "joined chat !");
    });



    // The user requests to join a certain room
    socket.on('join-chat-room', (room_id) => {
        console.log("user", socket.handshake.auth.name, "joined chatroom:", room_id);
        socket.join(room_id);

        socket.on('room-chat-message', (message) => {
            console.log("user", socket.handshake.auth.name, "sent room-chat-message:", message)
            
            io.to(room_id).emit("room-chat-message", {
                name: socket.handshake.auth.name,
                message
            });
        })
    });



    socket.on('public-chat-msg', (msg) => {
        console.log("public-chat-msg", msg);
        console.log("user ", JSON.parse(msg).name, "said:", JSON.parse(msg).message);
        io.sockets.emit('public-chat-msg', msg);
    });

});




app.get('/', (req: Request, res: Response) => {
    res.json({ data: 'hello world' });
});

server.listen(port, () => console.log(`Example app listening on port ${port}!`));


