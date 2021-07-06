import { createPool, PoolConnection, Pool } from "mysql2/promise";

class ConnectionPool {
    // Static
    private static connPoolSingleton: ConnectionPool | undefined;

    private static getInstance(): ConnectionPool {
        if (ConnectionPool.connPoolSingleton === undefined) {
            ConnectionPool.connPoolSingleton = new ConnectionPool();
        }

        return ConnectionPool.connPoolSingleton;
    }

    public static getPool(): Pool {
        return ConnectionPool.getInstance()._getPool();
    }

    public static async getConnection(): Promise<PoolConnection> {
        return await ConnectionPool.getInstance()._getConnection();
    }

    public static end() {
        ConnectionPool.getInstance()._end();
        ConnectionPool.connPoolSingleton = undefined;
    }

    /* ===================================================================== */

    // Instance
    private _pool: Pool;

    private _getPool(): Pool {
        return this._pool;
    }

    private async _getConnection(): Promise<PoolConnection> {
        return await this._pool.getConnection();
    }

    private _end() {
        this._pool.end();
    }

    /* ===================================================================== */

    private constructor() {
        this._pool = createPool({
            host: "localhost",
            user: "catbox_api",
            password: "Ca@tbo0x",
            database: "catbox",
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        this._pool.on("acquire", (c: PoolConnection) => {
            console.log(`Connection ${c.threadId} acquired.`);
        });

        this._pool.on("connection", (c: PoolConnection) => {
            c.query("SET autocommit=0");
            console.log(`Connection ${c.threadId} created.`);
        });

        this._pool.on("enqueue", () => {
            console.log("Waiting for available connection slot");
        });

        this._pool.on("release", (c: PoolConnection) => {
            console.log(`Connection ${c.threadId} released.`);
        });
    }
}

/* ===================================================================== */

export { ConnectionPool, PoolConnection };
