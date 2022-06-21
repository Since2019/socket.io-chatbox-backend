
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

    socket.emit("handshake", "Welcome!");

    socket.on('handshake', (data) => {
        console.log("handshake from client: ", data)
    });

    socket.on('user-name', (name) => {
        console.log("user ", name, "joined chat !");
    });

    socket.on('public-chat-msg', (msg) => {
        console.log("public-chat-msg",msg);
        console.log("user ", JSON.parse(msg).name, "said:",JSON.parse(msg).message);
        io.sockets.emit('public-chat-msg', msg);
    });

});




app.get('/', (req: Request, res: Response) => {
    res.json({ data: 'hello world' });
});
server.listen(port, () => console.log(`Example app listening on port ${port}!`));


