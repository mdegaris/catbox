import express from 'express';
import path from 'path';

import { mainApp, httpServer, socketServer } from './create-app-objs';
import { Message } from './lib/message';
import { MessageList } from './lib/messagelist';

const PORT = 8080;
const msgList = new MessageList();

mainApp.use(express.static(path.join(__dirname, 'public')));

socketServer.on('connection', (socket => {
  console.log('User connected. Socket ID: ' + socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected. Socket ID: ' + socket.id);
  });
}));

socketServer.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log(`Received message: ${msg}`);

    msgList.addMessage(new Message(msg, new Date()));
    socketServer.emit('chat message', msg);
  });  
});


httpServer.listen(PORT, () => {
  console.log('Listening on *:' + PORT);
});
