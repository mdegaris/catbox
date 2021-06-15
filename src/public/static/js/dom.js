class Dom {
    constructor() {

        const _elements = ['send-input', 'join-input', 'send-form', 'join-form', 'message-list'];

        this._cache = {};        

        this._domGet = (id) => {
            if (!(id in this._cache) || !this._cache[id]) {
                console.log(`Added '#${id}' to dom cache.`);
                this._cache[id] = document.getElementById(id);
            }
            return this._cache[id];
        }

        this.camelCase = (eid) => {
            const i = eid.indexOf("-");
            const first = eid.substr(0, i).toLowerCase();
            const second = eid.charAt(i+1).toUpperCase() + eid.slice(i+2).toLowerCase();
            return first + second;
        }

        for (let e of _elements) {
            eval(`this.${this.camelCase(e)} = () => this._domGet('${e}')`);
        }
    }
}


// const dom = {

//     _cache: {},

//     _elements: ['send-input', 'join-input', 'send-form', 'join-form', 'message-list'],

//     _domGet: (id) => {
//         if (!(id in this._cache) || !this._cache[id]) {
//             this._cache[id] = document.getElementById(id);
//         }
//         return this._cache[id];
//     },

//     elements: () => {

//         for (let e of dom._elements) {
//             dom._cache[e] = dom._domGet(e);
//         }
        
//         return dom._cache;
//     }
// }


const dom = new Dom();

export default dom;