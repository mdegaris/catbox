const socket = io();
var isInitialised = false;

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

function addSendMessageListener() {
    const sendForm = document.getElementById('send-form');

    if (sendForm) {
        sendForm.addEventListener('submit', e => sendHandler(e));
    }
}

function appendMessage(message) {
    messageList = document.getElementById('message-list');
    newItem = document.createElement('li');

    newItem.textContent = message;
    messageList.append(newItem);

    messageList.scrollTop = messageList.scrollHeight;
}


function addSocketListeners() {

    socket.on('initialise', (initMsgList) => {
        if (!isInitialised) {
            for (m of JSON.parse(initMsgList)) {
                appendMessage(m);
            }
        }

        isInitialised = true;
    });

    socket.on('chat message', (msg) => {
        console.log(`Got message: ${msg}`);
        appendMessage(msg);
    });
}

function addListeners() {
    addSendMessageListener();
    addSocketListeners();
}


$(() => {
    addListeners();
    socket.emit('initialise');
});






// function loginHandler(e) {
//     e.preventDefault();
// }

// function addLoginListener() {
//     const joinForm = $("#join-form");

//     if (joinForm) {
//         joinForm.addEventListener('submit', e => loginHandler(e));
//     }
// }