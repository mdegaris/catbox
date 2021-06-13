
import {load as loadChat} from './chat.js';
import {load as loadJoin} from './join.js';

const socket = io();
  

loadJoin('ajax-content');

socket.on('load-chat', () => {
    loadChat('ajax-content');
});



// function addSocketListeners() {

//     socket.on('switch content', (content) => {
//         if (content == 'join') {
//             contentId = '#join-fragment';
//         } else {
//             contentId = '#chat-fragment';
//         }
//     });
// }


// function loginHandler(e) {
//     e.preventDefault();
// }

// function addLoginListener() {
//     const joinForm = $("#join-form");

//     if (joinForm) {
//         joinForm.addEventListener('submit', e => loginHandler(e));
//     }
// }