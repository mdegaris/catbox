const socket = io();
const content = '_chat.html';

/**
 * Uses a socket to emit a message entered in the send form's
 * text input field.
 * @param {Event} e Send forn submit event
 */
function sendHandler(e) {
    e.preventDefault();
    const messageContainer = document.getElementById('messages-container');
    const sendInput = document.getElementById('text-input');
    const msg = sendInput.value;
    if (msg && messageContainer) {
        console.log(`Emit message to server: ${msg}`);
        socket.emit('chat-message', msg);
        sendInput.value = '';
    }
}

/**
 * Add the send form's event handler.
 */
function addSendMessageListener() {
    const sendForm = document.getElementById('send-form');
    if (sendForm) {
        sendForm.addEventListener('submit', e => sendHandler(e));
    }
}

/**
 * Append a new message string to the current list of messages.
 * @param {string} message A string representing a new message to be appended.
 * @param {boolean} isSystem Indicates if this is a special system-message.
 */
function appendMessage(message, isSystem = false) {
    const messageList = document.getElementById('message-list');
    const newItem = document.createElement('li');

    if (isSystem) {
        newItem.classList.add('system-message');
    }

    newItem.textContent = message;
    messageList.append(newItem);
    messageList.scrollTop = messageList.scrollHeight;
}

/**
 * Append a new system-message string to the current list of messages.
 * @param {string} message A string representing a new message from the System.
 */
function appendSystemMessage(message) {
    appendMessage(message, true);
}

/**
 * Add all the socket listeners used for chatting.
 * @param {Socket} socket Main chat socket.io Socket
 */
function addSocketListeners() {

    socket.on('init-chat', (initMsgList) => {
        if (!isInitialised) {
            for (m of JSON.parse(initMsgList)) {
                appendMessage(m);
            }
        }
        isInitialised = true;
    });

    socket.on('chat-message', (msg) => {
        console.log(`Got message: ${msg}`);
        appendMessage(msg);
    });

    socket.on('system-message', (msg) => {
        console.log(`Got message: ${msg}`);
        appendSystemMessage(msg);
    });
}


function _doLoad(containerId) {
    
    let container = document.getElementById(containerId);
    return fetch(`/content/${content}`)
                .then(response => response.text())
                .then(contentHtml => { container.innerHTML = contentHtml; });
}


function _addListeners(socket) {
    console.log('Add chat listeners...');
    addSocketListeners(socket);
    addSendMessageListener();
}

function _init() {
    console.log('init-chat...');
    socket.emit('initialise');
}

function _postLoad() {
    _addListeners();
    _init();
}

async function _loadContent(containerId) {
    await _doLoad(containerId);

    return new Promise((resolve, _) => {
        _postLoad();
        resolve();
    });
}

export async function load(containerId) {
    await _loadContent(containerId);
}

