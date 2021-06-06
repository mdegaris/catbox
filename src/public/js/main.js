

function sendHandler(e) {
    var socket = io();

    e.preventDefault();
    const messageContainer = document.getElementById('messages-container');
    const sendInput = document.getElementById('send-input');
    const msg = sendInput.value;
    if (msg && messageContainer) {
        messageContainer.innerText = msg;
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

function addListeners() {
    addSendMessageListener();
    // addLoginListener();
}


$(() => {
    addListeners();
});
