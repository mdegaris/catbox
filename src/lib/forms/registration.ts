import { Request } from 'express';
import { sqlStatements } from '../db/sql/statements';
import { transaction } from '../db/connect/db';
import { hashPassword } from '../auth/password';

class Registration {

    // Static

    private static readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    public static buildFromHttpRequest(request: Request): Registration {
        const newReg = new Registration(request.body.email, request.body.password);
        return newReg;
    }

    public static validatePassword(pw: string): boolean {
        return Registration.PASSWORD_REGEX.test(pw);
    }

    // Instanced

    private email: string;
    private plainPassword: string;

    private emailAlreadyExists(): Promise<boolean> {
        console.log('Check for duplicate email.');
        return Promise.resolve(false);
    }

    private async validate(): Promise<Array<string>> {

        console.log('Validate registration.');

        let validationErrors = Array<string>();
        const emailExists = await this.emailAlreadyExists();

        if (emailExists) {
            validationErrors.push('Email already taken.');
        }

        if (Registration.validatePassword(this.plainPassword) === false) {
            validationErrors.push('Password is invalid.');
        }

        return Promise.resolve(validationErrors);
    }

    public getEmail(): string {
        return this.email;
    }

    public toString(): string {
        const thisObj = {
            email: this.email
        };

        return JSON.stringify(thisObj);
    }

    public async create(): Promise<Array<any>> {

        const hashedPassword = await hashPassword(this.plainPassword);

        return new Promise((resolve, reject) => {
            this.validate().then((valErrors) => {
                if (valErrors.length > 0) {
                    console.log('Invalid registration.');
                    reject(valErrors);
                } else {
                    console.log('Valid registration.');

                    const bindVars = [this.email, hashedPassword];
                    const newUserTrans = transaction(sqlStatements.REGISTER_NEW_USER, bindVars);
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
