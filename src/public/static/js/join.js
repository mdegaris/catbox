const socket = io();
const content = '_join.html';


function loginHandler(e) {
    e.preventDefault();
    const joinInput = document.getElementById('text-input');
    const user = joinInput.value;
    if (user) {
        console.log(`Register new user: ${user}`);
        socket.emit('join-request', user);
        joinInput.value = '';
    }    
}

function addLoginListener() {
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
        joinForm.addEventListener('submit', e => loginHandler(e));
    }
}

function _doLoad(containerId) {
    
    let container = document.getElementById(containerId);
    return fetch(`/content/${content}`)
                .then(response => response.text())
                .then(contentHtml => { container.innerHTML = contentHtml; });
}

function _addListeners(socket) {
    console.log('Add join listeners...');
    addLoginListener();
}

function _postLoad() {
    _addListeners();
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

