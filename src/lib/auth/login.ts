import { Request } from "express";
import { sqlStatements } from "../db/sql/statements";
import { transaction, TransactionType } from "../db/transaction";
import { hashCompare } from "./password";

enum AuthStatus {
    AUTH_SUCCESS,
    BAD_PASSWORD,
    NO_USER_ACCOUNT,
}

const loginFormParams = {
    email: "email",
    password: "password",
};

function isValidLoginRequest(req: Request): boolean {
    return loginFormParams.email in req && loginFormParams.password in req;
}

async function authenticate(req: Request): Promise<AuthStatus> {
    return new Promise(async (resolve, reject) => {
        if (isValidLoginRequest(req)) {
            const loginEmail = req.body[loginFormParams.email];
            const loginPW = req.body[loginFormParams.password];

            const userResults = await transaction(
                TransactionType.QUERY,
                sqlStatements.PW_FROM_EMAIL,
                loginEmail
            );

            if (userResults.length == 1) {
                const userAcc = userResults[0];
                const auth = await hashCompare(loginPW, userAcc.password_hash);
                if (auth) {
                    resolve(AuthStatus.AUTH_SUCCESS);
                } else {
                    resolve(AuthStatus.BAD_PASSWORD);
                }
            } else if (userResults.length == 0) {
                resolve(AuthStatus.NO_USER_ACCOUNT);
            } else {
                reject(
                    `Found multiple users for ${loginEmail}. This should be impossible.`
                );
            }
        } else {
            const body = JSON.stringify(req.body);
            reject(
                `Invalid HTTP Request. Does not contain required params: ${body}`
            );
        }
    });
}

export { authenticate, AuthStatus };
