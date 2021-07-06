import { Request } from "express";
import { sqlStatements } from "../db/sql/statements";
import { transaction, TransactionType } from "../db/transaction";
import { hashPassword, validPassword } from "../auth/password";

class Registration {
    private static readonly FORM_PARAMS: Record<string, string> = {
        email: "email",
        password: "passowrd",
        birthdateDay: "dobDay",
        birthdateMonth: "dobMonth",
        birthdateYear: "dobYear",
        gender: "gender",
    };

    // Static

    private static parseRequestBody(req: Request): any {
        let paramMap = new Map<string, string>();
        for (let pn in Registration.FORM_PARAMS) {
            if (pn in req.body) {
                paramMap.set(pn, req.body[pn]);
            } else {
            }
        }
    }

    public static buildFromHttpRequest(request: Request): Registration {
        const newReg = new Registration(
            request.body.email,
            request.body.password
        );
        return newReg;
    }

    public static validatePassword(pw: string): boolean {
        return validPassword(pw);
    }

    // Instanced

    private email: string;
    private hashPassword?: string;
    private plainPassword: string;
    private dobDay?: number;
    private dobMonth?: number;
    private dobYear?: number;

    private emailAlreadyExists(): Promise<boolean> {
        console.log("Check for duplicate email.");
        return Promise.resolve(false);
    }

    private async validate(): Promise<Array<string>> {
        console.log("Validate registration.");

        let validationErrors = Array<string>();
        const emailExists = await this.emailAlreadyExists();

        if (emailExists) {
            validationErrors.push("Email already taken.");
        }

        if (Registration.validatePassword(this.plainPassword) === false) {
            validationErrors.push("Password is invalid.");
        }

        return Promise.resolve(validationErrors);
    }

    public getEmail(): string {
        return this.email;
    }

    public toString(): string {
        const thisObj = {
            email: this.email,
        };

        return JSON.stringify(thisObj);
    }

    public async create(): Promise<Array<any>> {
        const hashedPassword = await hashPassword(this.plainPassword);

        return new Promise((resolve, reject) => {
            this.validate().then((valErrors) => {
                if (valErrors.length > 0) {
                    console.log("Invalid registration.");
                    reject(valErrors);
                } else {
                    console.log("Valid registration.");

                    const bindVars = [this.email, hashedPassword];
                    const newUserTrans = transaction(
                        TransactionType.QUERY,
                        sqlStatements.REGISTER_NEW_USER,
                        bindVars
                    );
                    resolve(newUserTrans);
                }
            });
        });
    }

    constructor(em: string, pw: string) {
        this.email = em;
        this.plainPassword = pw;
    }
}

export { Registration };
