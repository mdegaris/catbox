
import {load as loadChat} from './chat.js';
import {load as loadJoin} from './join.js';

const socket = io();

loadJoin('ajax-content', socket);

socket.on('load-chat', () => {
    console.log('Client load chat.');
    loadChat('ajax-content', socket);
});

