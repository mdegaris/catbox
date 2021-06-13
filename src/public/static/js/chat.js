var isInitialised = false;
const content = '_chat.html';

/**
 * Uses a socket to emit a message entered in the send form's
 * text input field.
 * @param {Event} e Send forn submit event
 */
function sendHandler(e, socket) {
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
function addSendMessageListener(socket) {
    const sendForm = document.getElementById('send-form');
    if (sendForm) {
        sendForm.addEventListener('submit', e => sendHandler(e, socket));
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
function addSocketListeners(socket) {

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


function _doLoad(containerId) {
    
    let container = document.getElementById(containerId);
    return fetch(`/content/${content}`)
                .then(response => response.text())
                .then(contentHtml => { container.innerHTML = contentHtml; });
}


function _addListeners(socket) {
    console.log('Add chat listeners...');
    addSocketListeners(socket);
    addSendMessageListener(socket);
}

function _init(socket) {
    console.log('init-chat...');
    socket.emit('init-chat');
}

function _postLoad(socket) {
    _addListeners(socket);
    _init(socket);
}

async function _loadContent(containerId, socket) {
    await _doLoad(containerId);

    return new Promise((resolve, _) => {
        _postLoad(socket);
        resolve();
    });
}

export async function load(containerId, socket) {
    await _loadContent(containerId, socket);
}

