
import express from 'express';
import http from 'http';
import socketio from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);
// const io = new socketio.Server(server, {
//     cors: {
//         origin: "https://chatbox.degaris.uk",
//         methods: ["GET", "POST"]
//     }
// });


export const httpServer = server;
export const socketServer = io;
export const mainApp = app;
