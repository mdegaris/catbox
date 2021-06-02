
window.addEventListener('DOMContentLoaded', e => {

    const joinForm = document.getElementById('join-form');

    if (joinForm) {
        joinForm.addEventListener('submit', e => {
            e.preventDefault();
        });
    }
});