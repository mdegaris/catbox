import { ConnectionPool } from './connectionPool';


async function transaction(sql: string, binds?: any) : Promise<Array<any>> {
    
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
                            if (cmErr) {
                                conn.rollback(() => {
                                    reject(cmErr);
                                });
                            } else {
                                conn.end();
                                resolve(rows);
                            }
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