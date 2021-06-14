import express from 'express';
import socketio from 'socket.io';
import path from 'path';
import session from 'express-session';
import cookieParse from 'cookie-parser';

import { Config } from './conf/config';
import { mainApp, httpServer, socketServer } from './create-app-objs';
import { Message } from './lib/message';
import { ChatRoom } from './lib/chatRoom';
import { User } from './lib/user';


let SOCKET_USER_MAP = new Map();


const sessionMiddleware = session({
  secret: 'loki',
  cookie: {maxAge: 120000}
});

const logger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
  next();
}

mainApp.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/main.html'));
});

// =================================================================

mainApp.use(cookieParse());
mainApp.use(sessionMiddleware);
mainApp.use(logger);
mainApp.use(express.static(path.join(__dirname, 'public', 'static')));

// =================================================================

let defaultChatroom = new ChatRoom(Config.DEFAULT_CHATROOM_NAME);

// =================================================================

function initHandler(socket: socketio.Socket) {
  let recentMsgJSON = defaultChatroom.getMessageList().toJSON();
  console.log('Initialise messages...');
  socket.emit('load-recent-chat', recentMsgJSON);
}

// =================================================================

function chatHandler(msg: string, socket: socketio.Socket) {
  console.log(`Received message: ${msg}`);

  let user = SOCKET_USER_MAP.get(socket.id);
  let newMsg = new Message(msg, new Date(), user);
  defaultChatroom.getMessageList().addMessage(newMsg);
  socketServer.emit('chat-message', newMsg.getText());
}

// =================================================================

function userJoinHandler(user: string, socket: socketio.Socket) {
  
  console.log(`Received join-request new user: ${user}`);

  let newUser = new User(user, '127.0.0.1', new Date());
  defaultChatroom.getUserList().addUser(newUser);
  
  SOCKET_USER_MAP.set(socket.id, newUser);
  
  socket.emit('load-chat');
  console.log(`Load the chat window. ${socket.id}`);

  let joinedMsg = new Message(`${user} has joined the chat.`, new Date(), User.SYSTEM_USER);
  socketServer.emit('system-message', joinedMsg.getText());
}

// =================================================================

function disconnectHandler(reason: string) {
  console.log(`User disconnected. ${reason}`);
}

// =================================================================

socketServer.on('connection', ((socket) => {

  console.log(`Client connected. Socket ID: ${socket.id}`);

  socket.on('disconnect', disconnectHandler);
  socket.on('chat-message', (msg) => {
    chatHandler(msg, socket);
  });
  socket.on('join-request', (user) => {
    userJoinHandler(user, socket);
  });
  socket.on('init-chat', () => {
    initHandler(socket);
  });

}));

// =================================================================

httpServer.listen(Config.PORT, () => {
  console.log(`Listening on *: ${Config.PORT}`);
});
