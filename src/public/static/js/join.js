import dom from './dom.js';

const content = '_join.html';

function loginHandler(e, socket) {
    e.preventDefault();
    const username = dom.joinInput().value;
    if (username) {
        console.log(`Register new user: ${username}`);
        socket.emit('join-request', username);
        dom.joinInput().value = '';
    }    
}

async function _doLoad(containerId) {
    
    const container = document.getElementById(containerId);
    const response = await fetch(`/content/${content}`);
    const contentHtml = await response.text();
    container.innerHTML = contentHtml;
}

function _addListeners(socket) {
    console.log('Add join listeners...');
    dom.joinForm().addEventListener('submit', e => loginHandler(e, socket));
}

function _postLoad(socket) {
    _addListeners(socket);
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

