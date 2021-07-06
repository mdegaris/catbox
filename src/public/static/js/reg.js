import DOM from './dom.js';

function assignValidation(fieldName, fieldInput, fieldError, valResults) {

    fieldError.innerText = valResults[fieldName];

    if (valResults[fieldName].length > 0) {
        fieldInput.classList.remove('validation-pass');
        fieldInput.classList.add('validation-error');
    } else {
        fieldInput.classList.remove('validation-error');
        fieldInput.classList.add('validation-pass');
    }
}

async function validationHandler(e, form) {

    const regData = new FormData(form);
    regData.append('fieldChanged', e.target.name)
    let jData = {};
    for (const [k, v] of regData.entries()) {
        jData[k] = v;
    };

    let response = await fetch('/validate-reg-dynamic', {
        headers: {
            'content-type': 'application/json',
        },
        cache: 'no-cache',
        method: 'POST',
        body: JSON.stringify(jData)
    });

    let valResults = await response.json();

    const emailError = DOM.getElement(DOM.ids.emailError);
    const emailInput = DOM.getElement(DOM.ids.emailInput);
    const pwError = DOM.getElement(DOM.ids.passwordError);
    const pwInput = DOM.getElement(DOM.ids.passwordInput);

    assignValidation('email', emailInput, emailError, valResults);
    assignValidation('password', pwInput, pwError, valResults);

    console.log(valResults);
}

function addRegisterListeners() {
    const formEle = document.getElementById('register-form');
    const inputs = formEle.querySelectorAll('input');

    inputs.forEach((input) => {
        input.addEventListener('focusout', e => validationHandler(e, formEle));
    });
}

addRegisterListeners();