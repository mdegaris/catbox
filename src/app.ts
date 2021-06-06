import express from 'express';
import path from 'path';


const PORT = 8080;

import { mainApp, httpServer, socketServer } from './create-app-objs';

mainApp.use(express.static(path.join(__dirname, 'public')));

socketServer.on('connection', (socket => {
    console.log(`User connected.  Socket ID: ` + socket.id);
    socket.on('disconnect', () => {
        console.log(`User disconnected.  Socket ID: ` + socket.id);
    });
}));

socketServer.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
    });
  });

httpServer.listen(PORT, () => {
    console.log(`Listening on *:` + PORT);
});
