import { ConnectionPool, PoolConnection } from './connectionPool';
import { RowDataPacket, FieldPacket } from 'mysql2';


// ============================================================

enum TransactionType {
    QUERY,
    EXECUTE
}

// ============================================================

function massageResults(r: RowDataPacket[]) {
    return Array.from(JSON.parse(JSON.stringify(r)));
}

// ============================================================

async function _query(conn: PoolConnection, sql: string, binds?: any | any[]): Promise<Array<any>> {
    let results: RowDataPacket[];
    let _fields: FieldPacket[];
    [results, _fields] = await conn.query(sql, binds);

    return massageResults(results);
}

// ============================================================

async function _execute(conn: PoolConnection, sql: string, binds?: any | any[]) {
    let results: RowDataPacket[];
    let _fields: FieldPacket[];
    [results, _fields] = await conn.execute(sql, binds);
    await conn.commit();

    return massageResults(results);
}

// ============================================================

async function transaction(tType: TransactionType, sql: string, binds?: any): Promise<any> {

    const conn = await ConnectionPool.getConnection();

    try {
        await conn.beginTransaction();

        let rows: Array<any>;
        switch (tType) {
            case TransactionType.QUERY:
                rows = await _query(conn, sql, binds);
                break;
            case TransactionType.EXECUTE:
                rows = await _execute(conn, sql, binds);
                break;
            default:
                throw Error('Unknown TransactionType.');
        }

        return rows;

    } catch (err) {
        conn.rollback();
        console.log(err);
        throw err;
    } finally {
        conn.release();
    }
}

// ============================================================

export { TransactionType, transaction };

// ============================================================

// Tests

async function dbTestQuery1() {
    const r = await transaction(TransactionType.QUERY, 'SELECT * FROM catbox._test WHERE test_id >= ?', [1]);
    console.log("name: " + r[0].name);
}

async function dbTestQuery2() {
    const r = await transaction(TransactionType.EXECUTE, 'SELECT * FROM catbox._test WHERE test_id >= ?', [2]);
    console.log("name: " + r[0].name);
}

async function test() {
    await dbTestQuery1();
    await dbTestQuery2();
    ConnectionPool.end();
}

test();

// ============================================================
