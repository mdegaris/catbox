import validator from 'validator';
import { Request } from 'express';
import { ParamNames, RegForm } from './formParamNames';
import { transaction, TransactionType } from '../db/transaction';
import { sqlStatements } from '../db/sql/statements';


enum ValidationType {
    FULL,
    LITE
}

class RegValidator {

    private async _emailAlreadyExists(): Promise<boolean> {
        console.log('Check for duplicate email.');

        const email = this.form.getValue(ParamNames.email);
        const foundUsers = await transaction(TransactionType.QUERY,
            sqlStatements.USER_FROM_EMAIL,
            email);

        const foundUsersLen = foundUsers.length;
        if (foundUsersLen == 1) {
            return Promise.resolve(true);
        } else if (foundUsersLen > 1) {
            throw Error(`Unexpected number of users found for ${email} (${foundUsersLen})`);
        }

        return Promise.resolve(false);
    }


    private async _emailValid(email: string): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            const isValid = validator.isEmail(email);
            resolve(isValid);
        });
    }

    private async _validateEmail(vt: ValidationType) {

        const email = this.form.getValue(ParamNames.email);
        if (validator.isEmpty(email, { ignore_whitespace: true })) {
            if (vt == ValidationType.FULL) {
                this.form.setError(ParamNames.email, 'enter an email');
            }
        } else {
            const isValid = await this._emailValid(email);
            if (!isValid) {
                this.form.setError(ParamNames.email, 'invalid email');
            } else {
                const emailExists = await this._emailAlreadyExists();
                if (emailExists) {
                    this.form.setError(ParamNames.email, 'email already registered');
                }
            }
        }
    }

    private async _validatePassword() {
        const pw = this.form.getValue(ParamNames.password);
        const pwValid = validator.isStrongPassword(pw, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
        });

        if (!pwValid) {
            this.form.setError(ParamNames.password,
                'must be a min of 8 character, with at least 1 uppercase, 1 lowercase, and 1 number');
        }
    }

    public getForm(): RegForm {
        return this.form;
    }

    public getErrorsJSON(): JSON {
        return this.form.getErrorsJSON();
    }

    public async validateFields(vt: ValidationType) {
        await this._validateEmail(vt);
        await this._validatePassword();
    }

    constructor(private form: RegForm) { };
}

async function liteValidation(req: Request) {


    const rf: RegForm = new RegForm(req);
    const validator = new RegValidator(rf);

    await validator.validateFields(ValidationType.LITE);
    return validator;
}


export { liteValidation }