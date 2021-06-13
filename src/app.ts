import express from 'express';
import session from 'express-session';
import path from 'path';

import { Config } from './conf/config';
import { mainApp, httpServer, socketServer } from './create-app-objs';
import { Message } from './lib/message';
import { ChatRoom } from './lib/chatRoom';
import { User } from './lib/user';


const logger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
  next();
}

var currentUser = User.UNDEFINED_USER;


mainApp.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/main.html'));
  // if (currentUser.equals(User.UNDEFINED_USER)) {
  //   res.sendFile(path.join(__dirname, 'public', '/main.html'));
  // } else {
  //   res.sendFile(path.join(__dirname, 'public', '/chat.html'));
  // }
});

mainApp.use(logger);

mainApp.use(express.static(path.join(__dirname, 'public', 'static')));


let defaultChatroom = new ChatRoom(Config.DEFAULT_CHATROOM_NAME);
// defaultChatroom.getUserList().addUser(User.TEST_USER);

function initHandler() {
  console.log('Initialise messages.');
  socketServer.emit('initialise', defaultChatroom.getMessageList().toJSON());
}

function chatHandler(msg: string) {
  console.log(`Received message: ${msg}`);

  let newMsg = new Message(msg, new Date(), currentUser);
  defaultChatroom.getMessageList().addMessage(newMsg);
  socketServer.emit('chat-message', newMsg.getText());
}

function userJoinHandler(user: string) {
  
  console.log(`Received join-request new user: ${user}`);

  let newUser = new User(user, '127.0.0.1', new Date());
  defaultChatroom.getUserList().addUser(newUser);
  currentUser = newUser;
  
  socketServer.emit('load-chat');
  console.log('Load the chat window.');

  let joinedMsg = new Message(`${user} has joined the chat.`, new Date(), User.SYSTEM_USER);
  socketServer.emit('system-message', joinedMsg.getText());
}

function disconnectHandler(reason: string) {
  console.log(`User disconnected. ${reason}`);
}

socketServer.on('connection', ((socket) => {

  console.log('Client connected. Socket ID: ' + socket.id);

  socket.on('initialise', initHandler);
  socket.on('disconnect', disconnectHandler);
  socket.on('chat-message', chatHandler);
  socket.on('join-request', userJoinHandler);

}));


httpServer.listen(Config.PORT, () => {
  console.log('Listening on *:' + Config.PORT);
});
