import mysql2, { Connection, FieldPacket, OkPacket, Pool, PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';
// import mysql2Promise, { Connection as PromiseConnection, Pool as PromisePool } from 'mysql2/promise';



class ConnectionPool {

  // Static
  private static connPoolSingleton: ConnectionPool;

  public static getInstance(): ConnectionPool {
    if (ConnectionPool.connPoolSingleton === undefined) {
      ConnectionPool.connPoolSingleton = new ConnectionPool();
    }

    return ConnectionPool.connPoolSingleton;
  }

  public static getPool(): Pool {
    return ConnectionPool.getInstance()._getPool();
  }

  public static getConnectionPromise(): Promise<Connection> {
    return ConnectionPool.getInstance()._getConnectionPromise();
  }

  public static end() {
    ConnectionPool.getInstance()._end();
  }

  /* ===================================================================== */

  // Instance
  private pool: Pool;


  private _getPool(): Pool {
    return this.pool;
  }

  private _getConnectionPromise(): Promise<Connection> {

    return new Promise<Connection>((resolve, reject) => {
      this._getPool().getConnection((cnErr, conn) => {
        if (cnErr) {
          reject(cnErr);
        } else {
          resolve(conn);
        }
      });
    });
  }

  private _end() {
    this.pool.end();
  }

  /* ===================================================================== */

  private constructor() {
    this.pool = mysql2.createPool({
      host: 'localhost',
      user: 'catbox_api',
      password: 'Ca@tbo0x',
      database: 'catbox',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    this.pool.on('acquire', (c) => {
      console.log(`Connection ${c.threadId} acquired.`)
    });

    this.pool.on('connection', (c) => {
      c.query('SET autocommit=0');
      console.log(`Connection ${c.threadId} created.`)
    });

    this.pool.on('enqueue', () => {
      console.log('Waiting for available connection slot');
    });

    this.pool.on('release', (c) => {
      console.log(`Connection ${c.threadId} released.`)
    });
  }
}

/* ===================================================================== */

export { ConnectionPool };
