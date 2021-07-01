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
exports.transaction = exports.TransactionType = void 0;
var connectionPool_1 = require("./connectionPool");
// =================================================
var TransactionType;
(function (TransactionType) {
    TransactionType[TransactionType["QUERY"] = 0] = "QUERY";
    TransactionType[TransactionType["EXECUTE"] = 1] = "EXECUTE";
})(TransactionType || (TransactionType = {}));
exports.TransactionType = TransactionType;
// =================================================
function massageResults(r) {
    return Array.from(JSON.parse(JSON.stringify(r)));
}
// =================================================
function _query(conn, sql, binds) {
    return __awaiter(this, void 0, void 0, function () {
        var results, _fields;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, conn.query(sql, binds)];
                case 1:
                    _a = _b.sent(), results = _a[0], _fields = _a[1];
                    return [2 /*return*/, massageResults(results)];
            }
        });
    });
}
// =================================================
function _execute(conn, sql, binds) {
    return __awaiter(this, void 0, void 0, function () {
        var results, _fields;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, conn.execute(sql, binds)];
                case 1:
                    _a = _b.sent(), results = _a[0], _fields = _a[1];
                    return [4 /*yield*/, conn.commit()];
                case 2:
                    _b.sent();
                    return [2 /*return*/, massageResults(results)];
            }
        });
    });
}
// =================================================
function transaction(tType, sql, binds) {
    return __awaiter(this, void 0, void 0, function () {
        var conn, rows, _a, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, connectionPool_1.ConnectionPool.getConnection()];
                case 1:
                    conn = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 10, 11, 12]);
                    return [4 /*yield*/, conn.beginTransaction()];
                case 3:
                    _b.sent();
                    rows = void 0;
                    _a = tType;
                    switch (_a) {
                        case TransactionType.QUERY: return [3 /*break*/, 4];
                        case TransactionType.EXECUTE: return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 8];
                case 4: return [4 /*yield*/, _query(conn, sql, binds)];
                case 5:
                    rows = _b.sent();
                    return [3 /*break*/, 9];
                case 6: return [4 /*yield*/, _execute(conn, sql, binds)];
                case 7:
                    rows = _b.sent();
                    return [3 /*break*/, 9];
                case 8: throw Error('Unknown TransactionType.');
                case 9: return [2 /*return*/, rows];
                case 10:
                    err_1 = _b.sent();
                    conn.rollback();
                    console.log(err_1);
                    throw err_1;
                case 11:
                    conn.release();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.transaction = transaction;
// =================================================
// Tests
function dbTestQuery1() {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, transaction(TransactionType.QUERY, 'SELECT * FROM catbox._test WHERE test_id >= ?', [1])];
                case 1:
                    r = _a.sent();
                    console.log("name: " + r[0].name);
                    return [2 /*return*/];
            }
        });
    });
}
function dbTestQuery2() {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, transaction(TransactionType.EXECUTE, 'SELECT * FROM catbox._test WHERE test_id >= ?', [2])];
                case 1:
                    r = _a.sent();
                    console.log("name: " + r[0].name);
                    return [2 /*return*/];
            }
        });
    });
}
function test() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbTestQuery1()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dbTestQuery2()];
                case 2:
                    _a.sent();
                    connectionPool_1.ConnectionPool.end();
                    return [2 /*return*/];
            }
        });
    });
}
test();
// =================================================
