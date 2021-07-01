import { validate_async } from 'email-validator';
import { Request } from 'express';
import { transaction, TransactionType } from '../db/transaction';
import { sqlStatements } from '../db/sql/statements';


class RegValidator {

    private static readonly FORM_PARAMS = {
        email: 'email',
        password: 'passowrd',
        birthdateDay: 'dobDay',
        birthdateMonth: 'dobMonth',
        birthdateYear: 'dobYear',
        gender: 'gender'
    }

    private request: Request;
    private paramsMap: Map<string, string>;


    private async _emailAlreadyExists(): Promise<boolean> {
        console.log('Check for duplicate email.');

        const userId = await transaction(TransactionType.QUERY, sqlStatements.USER_FROM_EMAIL, this.paramsMap.get(RegValidator.FORM_PARAMS.email));

        return Promise.resolve(false);
    }

    private async _emailValidator(email: string): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            validate_async(email, (err, valid) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(valid);
                }
            });
        });
    }


    public validateEmail() {

        const emailPname = RegValidator.FORM_PARAMS.email;
        if (this.paramsMap.has(emailPname)) {
            let email = this.paramsMap.get(emailPname);
            if (email === undefined) {

            } else {
                this._emailValidator(email)
                    .then((isValid) => {

                    })
                    .catch(err => {

                    });
            }
        }



    }

    private validatePassword() {

    }

    private validateBirthdate() {

    }

    private validateGender() {

    }

    private validateUsername() {

    }

    private parseRequestBody(req: Request) {

        for (let pname in RegValidator.FORM_PARAMS) {
            if (pname in req.body) {
                this.paramsMap.set(pname, req.body.pname);
            }
        }
    }

    constructor(req: Request) {
        this.request = req;
        this.paramsMap = new Map<string, string>();
    }
}
