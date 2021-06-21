import { ConnectionPool } from './connectionPool';


async function transaction(sql: string, binds: Array<string | number> = Array()): Promise<Array<any>> {

    const conn = await ConnectionPool.getConnectionPromise();

    return new Promise<Array<any>>((resolve, reject) => {
        conn.beginTransaction((trError) => {
            if (trError) {
                reject(trError);
            } else {
                conn.execute(sql, binds, (exError, results) => {
                    if (exError) {
                        conn.rollback(() => {
                            reject(exError);
                        });
                    } else {
                        const rows = Array.from(JSON.parse(JSON.stringify(results)));
                        conn.commit((cmErr) => {                            
                            ConnectionPool.end();
                            resolve(rows);
                        });                                                
                    }
                });
            }
        });
    });
}

export { transaction };


function dbTestQuery() {
    const p = transaction('SELECT * FROM catbox._test WHERE test_id >= ?', [1]);
    p.then((r) => console.log(r[0].name))
        .catch((e) => { console.log(e.stack) });
}

function test() {
    dbTestQuery();
}