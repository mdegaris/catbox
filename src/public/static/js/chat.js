import dom from './dom.js';

var isInitialised = false;
const content = '_chat.html';


function isValidMessageString(str) {
    return (str && (str.trim().length) > 0) ? true : false;
}


/**
 * Uses a socket to emit a message entered in the send form's
 * text input field.
 * @param {Event} e Send forn submit event
 */
function sendHandler(e, socket) {
    e.preventDefault();
    const msg = dom.sendInput().value;
    if (isValidMessageString(msg)) {
        console.log(`Emit message to server: ${msg}`);
        socket.emit('chat-message', msg);
        dom.sendInput().value = '';
    }
}


/**
 * Append a new message string to the current list of messages.
 * @param {string} message A string representing a new message to be appended.
 * @param {boolean} isSystem Indicates if this is a special system-message.
 */
function appendMessage(message, isSystem = false) {

    const newItem = document.createElement('li');

    if (isSystem) {
        newItem.classList.add('system-message');
    }

    newItem.textContent = message;
    dom.messageList().append(newItem);
    dom.messageList().scrollTop = dom.messageList().scrollHeight;
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
function _addSocketListeners(socket) {

    socket.on('load-recent-chat', (initMsgList) => {
        console.log('load-recent-chat');
        if (!isInitialised) {
            for (let m of JSON.parse(initMsgList)) {
                if (m) {
                    appendMessage(m);
                }
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


async function _doLoad(containerId) {

    const container = document.getElementById(containerId);
    const response = await fetch(`/content/${content}`);
    const contentHtml = await response.text();
    container.innerHTML = contentHtml;
}


function _addListeners(socket) {
    console.log('Add chat listeners...');
    dom.sendForm().addEventListener('submit', e => sendHandler(e, socket));
    _addSocketListeners(socket);
}

function _init(socket) {
    console.log('init-chat...');
    socket.emit('init-chat');
}

function _postLoad(socket) {
    _addListeners(socket);
    _init(socket);
    dom.sendInput().focus();
}

async function _loadContent(containerId, socket) {

    await _doLoad(containerId);
    return new Promise((resolve, _) => {
        _postLoad(socket);
        resolve();
    });
}

export async function load(containerId, socket) {
    console.log('Chat page loader.');
    await _loadContent(containerId, socket);
}