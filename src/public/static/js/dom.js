/**************************************** */
/* Add required DOM HTML ids to the ELEMENT_IDS mapping. */
/**************************************** */

/**
 * Mapping of available HTML element IDs.
 */
const ELEMENT_IDS = {
    sendInput: 'send-input',
    joinInput: 'join-input',
    sendForm: 'send-form',
    registerForm: 'register-form',
    messageList: 'message-list',
    emailInput: 'email-input',
    emailError: 'email-error',
    passwordInput: 'password-input',
    passwordError: 'password-error'
}


const DOM = {

    /**
     * A cache of HTML element ids to Element object.
     */
    _cache: {},

    /**
     * Reference the HTML Element IDS constant list.
     */
    ids: ELEMENT_IDS,

    /**
     *  Retrives the HTML Element object for the give ID.
     *  If Element object is retrieved from cache if it exists,
     *  otherwise it's queried from the dom and placed in the cache.
     *
     * @param {string} id HTML element id
     * @returns {Element} HTML element object
     */
    getElement: function(id) {
        if (!(id in this._cache) || !this._cache[id]) {
            console.log(`Added '#${id}' to dom cache.`);
            this._cache[id] = document.getElementById(id);
        }
        return this._cache[id];
    }
}

export default DOM;