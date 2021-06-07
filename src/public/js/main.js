const socket = io();

function sendHandler(e) {
    
    e.preventDefault();
    const messageContainer = document.getElementById('messages-container');
    const sendInput = document.getElementById('send-input');
    const msg = sendInput.value;
    if (msg && messageContainer) {
        console.log(`Emit message to server: ${msg}`);
        socket.emit('chat message', msg);
        sendInput.value = '';
    }
}

function loginHandler(e) {
    e.preventDefault();
}

function addSendMessageListener() {
    const sendForm = document.getElementById('send-form');

    if (sendForm) {
        sendForm.addEventListener('submit', e => sendHandler(e));
    }
}

function addLoginListener() {
    const joinForm = $("#join-form");

    if (joinForm) {
        joinForm.addEventListener('submit', e => loginHandler(e));
    }
}


function appendMessage(message) {
    messageList = document.getElementById('message-list');
    newItem = document.createElement('li');

    newItem.textContent = message;
    messageList.append(newItem);
    
}

// function initMessageList() {
//     console.log(`Emit message to server: ${msg}`);
//     socket.emit('chat message', msg);
//     sendInput.value =
// }

function addListeners() {
    addSendMessageListener();
    // addLoginListener();
}


$(() => {
    addListeners();

    socket.on('chat message', (msg) => {
        console.log(`Got message: ${msg}`);
        appendMessage(msg);
    });
});
