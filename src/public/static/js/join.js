
const content = '_join.html';


function loginHandler(e, socket) {
    e.preventDefault();
    const joinInput = document.getElementById('text-input');
    const user = joinInput.value;
    if (user) {
        console.log(`Register new user: ${user}`);
        socket.emit('join-request', user);
        joinInput.value = '';
    }    
}

function addLoginListener(socket) {
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
        joinForm.addEventListener('submit', e => loginHandler(e, socket));
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
    addLoginListener(socket);
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

