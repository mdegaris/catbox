import validator from "validator";
import { FIELD_NAMES } from "./formFields";
import { RegForm } from "./regForm";
import { transaction, TransactionType } from "../db/transaction";
import { sqlStatements } from "../db/sql/statements";
import { Request } from "express";
import { Exception } from "../throwable/exception";

enum ValidationType {
    FULL,
    LITE,
}

/**
 *
 */
class RegValidator {
    /**
     * Holds validation error message constants.
     */
    private static readonly VAL_ERRORS = {
        emailAlreadyExists: "this email has already registered",
        emailInvalidFormat: "invalid email forma",
        emailEmpty: "enter an email",
        passwordTooWeak:
            "must be a min of 8 character, with at least 1 uppercase, 1 lowercase, and 1 number",
    };

    /**
     * Use's the form's email to check whether it already exists in the database.
     *
     * @param email Email address string to check.
     * @returns A boolean Promise indicating whether
     *          an email has been registered in the database.
     */
    private static async emailAlreadyExists(email: string): Promise<boolean> {
        console.log("Check for duplicate email.");

        const foundUsers = await transaction(
            TransactionType.QUERY,
            sqlStatements.USER_FROM_EMAIL,
            email
        );

        const foundUsersLen = foundUsers.length;
        if (foundUsersLen == 1) {
            return Promise.resolve(true);
        } else if (foundUsersLen > 1) {
            throw new Exception(
                Exception.CODES.unexpectedDatabaseResults,
                `Unexpected number of users found for ${email} (${foundUsersLen})`
            );
        }

        return Promise.resolve(false);
    }

    /**
     * Check's whether an email string matches the expected format of an email address.
     *
     * @param email Email address string to check.
     * @returns A boolean Promise indicating whether
     *          the email string is indeed an email address.
     */
    private static async emailValid(email: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const isValid = validator.isEmail(email);
            resolve(isValid);
        });
    }

    /**
     * Performs all the requested validation checks on the form's current
     * email string. A LITE validation will not check for an empty email.
     *
     * @param vt Validation type; FULL or LITE.
     */
    private async validateEmail(vt: ValidationType) {
        const email = this.form.getValue(FIELD_NAMES.email);
        if (validator.isEmpty(email, { ignore_whitespace: true })) {
            if (vt == ValidationType.FULL) {
                this.form.setError(
                    FIELD_NAMES.email,
                    RegValidator.VAL_ERRORS.emailEmpty
                );
            }
        } else {
            const isValid = await RegValidator.emailValid(email);
            if (!isValid) {
                this.form.setError(
                    FIELD_NAMES.email,
                    RegValidator.VAL_ERRORS.emailInvalidFormat
                );
            } else {
                const emailExists = await RegValidator.emailAlreadyExists(
                    email
                );
                if (emailExists) {
                    this.form.setError(
                        FIELD_NAMES.email,
                        RegValidator.VAL_ERRORS.emailAlreadyExists
                    );
                }
            }
        }
    }

    /**
     * Check a password string meets the necessary strength
     * requirements, i.e.:
     * at least 8 chars, with 1 lower, 1 upper, 1 number.
     */
    private async validatePassword() {
        const pw = this.form.getValue(FIELD_NAMES.password);
        const pwValid = validator.isStrongPassword(pw, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
        });

        if (!pwValid) {
            this.form.setError(
                FIELD_NAMES.password,
                RegValidator.VAL_ERRORS.passwordTooWeak
            );
        }
    }

    /**
     * Getter for the RegForm property associated with this RegValidator
     * @returns The RegForm instance
     */
    public getForm(): RegForm {
        return this.form;
    }

    /**
     * Convert the current validation errors into a JSON object,
     * ready to be used by a HTTP response.
     * @returns A JSON object, mapping form field to validation error.
     */
    public getErrorsJSON(): JSON {
        return this.form.getErrorsJSON();
    }

    /**
     *
     * @param vt
     */
    public async validateFields(vt: ValidationType) {
        await this.validateEmail(vt);
        await this.validatePassword();
    }

    /**
     * Constructs a new RegValidator instance, with a RegForm instance.
     * @param form A RegForm instance.
     */
    constructor(private form: RegForm) {}
}

/**
 * Perform all the requested validation of a registration form.
 *
 * @param req HTTP Request containing all the submitted form input values.
 * @param vt  The ValidationType of the required validation (LITE | FULL)
 * @returns A JSON Promise of all the validation errors.
 */
async function validate(req: Request, vt: ValidationType): Promise<JSON> {
    // Create a new RegValidator.
    const rf = new RegForm(req);
    const validator = new RegValidator(rf);

    // Do the validation.
    await validator.validateFields(vt);

    // Return the validation erros as a JSON Promise.
    return validator.getErrorsJSON();
}

export { validate, ValidationType };
