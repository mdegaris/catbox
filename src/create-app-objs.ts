
import express from 'express';
import http from 'http';
import socketio from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server, {
    connectTimeout: 120000
});

export const httpServer = server;
export const socketServer = io;
export const mainApp = app;
