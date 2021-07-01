"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ConnectionPool = void 0;
var promise_1 = require("mysql2/promise");
var ConnectionPool = /** @class */ (function () {
    /* ===================================================================== */
    function ConnectionPool() {
        this._pool = promise_1.createPool({
            host: 'localhost',
            user: 'catbox_api',
            password: 'Ca@tbo0x',
            database: 'catbox',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        this._pool.on('acquire', function (c) {
            console.log("Connection " + c.threadId + " acquired.");
        });
        this._pool.on('connection', function (c) {
            c.query('SET autocommit=0');
            console.log("Connection " + c.threadId + " created.");
        });
        this._pool.on('enqueue', function () {
            console.log('Waiting for available connection slot');
        });
        this._pool.on('release', function (c) {
            console.log("Connection " + c.threadId + " released.");
        });
    }
    ConnectionPool.getInstance = function () {
        if (ConnectionPool.connPoolSingleton === undefined) {
            ConnectionPool.connPoolSingleton = new ConnectionPool();
        }
        return ConnectionPool.connPoolSingleton;
    };
    ConnectionPool.getPool = function () {
        return ConnectionPool.getInstance()._getPool();
    };
    ConnectionPool.getConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ConnectionPool.getInstance()._getConnection()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ConnectionPool.end = function () {
        ConnectionPool.getInstance()._end();
        ConnectionPool.connPoolSingleton = undefined;
    };
    ConnectionPool.prototype._getPool = function () {
        return this._pool;
    };
    ConnectionPool.prototype._getConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._pool.getConnection()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ConnectionPool.prototype._end = function () {
        this._pool.end();
    };
    return ConnectionPool;
}());
exports.ConnectionPool = ConnectionPool;
// class ConnectionPool {
//     // Static
//     private static connPoolSingleton: ConnectionPool;
//     public static getInstance(): ConnectionPool {
//         if (ConnectionPool.connPoolSingleton === undefined) {
//             ConnectionPool.connPoolSingleton = new ConnectionPool();
//         }
//         return ConnectionPool.connPoolSingleton;
//     }
//     public static getPool(): Pool {
//         return ConnectionPool.getInstance()._getPool();
//     }
//     public static getConnectionPromise(): Promise<Connection> {
//         return ConnectionPool.getInstance()._getConnectionPromise();
//     }
//     public static end() {
//         ConnectionPool.getInstance()._end();
//     }
//     /* ===================================================================== */
//     // Instance
//     private pool: Pool;
//     private _getPool(): Pool {
//         return this.pool;
//     }
//     private _getConnectionPromise(): Promise<Connection> {
//         return new Promise<Connection>((resolve, reject) => {
//             this._getPool().getConnection((cnErr, conn) => {
//                 if (cnErr) {
//                     reject(cnErr);
//                 } else {
//                     resolve(conn);
//                 }
//             });
//         });
//     }
//     private _end() {
//         this.pool.end();
//     }
//     /* ===================================================================== */
//     private constructor() {
//         this.pool = mysql2.createPool({
//             host: 'localhost',
//             user: 'catbox_api',
//             password: 'Ca@tbo0x',
//             database: 'catbox',
//             waitForConnections: true,
//             connectionLimit: 10,
//             queueLimit: 0
//         });
//         this.pool.on('acquire', (c) => {
//             console.log(`Connection ${c.threadId} acquired.`)
//         });
//         this.pool.on('connection', (c) => {
//             c.query('SET autocommit=0');
//             console.log(`Connection ${c.threadId} created.`)
//         });
//         this.pool.on('enqueue', () => {
//             console.log('Waiting for available connection slot');
//         });
//         this.pool.on('release', (c) => {
//             console.log(`Connection ${c.threadId} released.`)
//         });
//     }
// }
// /* ===================================================================== */
// export { ConnectionPool, Connection };
