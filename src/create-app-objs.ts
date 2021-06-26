
import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server, {
    connectTimeout: 120000
});

// Load view engine (templating)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

export const httpServer = server;
export const socketServer = io;
export const catboxApp = app;
