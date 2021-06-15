
import {load as loadChat} from './chat.js';
import {load as loadJoin} from './join.js';

const socket = io();

console.log('Bootstrap app.');
socket.emit('bootstrap');


socket.on('load-chat', () => {
    console.log('Client load chat.');
    loadChat('ajax-content', socket);
});


socket.on('load-join', () => {
    console.log('Client load join.');
    loadJoin('ajax-content', socket);
});
