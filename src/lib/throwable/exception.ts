class Exception extends Error {
    public static readonly CODES = {
        invalidHttpRequest: 1001,
        missingFormParams: 1002,
        unexpectedDatabaseResults: 1003,
    };

    /**
     *
     * @returns
     */
    public getCode() {
        return this.code;
    }

    /**
     *
     * @param code
     * @param message
     */
    constructor(private code: number, message: string) {
        super(message);
    }
}

export { Exception };
