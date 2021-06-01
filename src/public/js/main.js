

const messageContainer = document.getElementById('message-container');
const form = document.getElementById('send-message-form');
const input = document.getElementById('send-message-input');

input.addEventListener('submit', e => {
    e.preventDefault();
    var v = input.value;
    if (v && messageContainer) {
        messageContainer.value = v;
    }
});