
import { Request } from 'express';

const ParamNames = {
    email: 'email',
    password: 'password',
    birthdateDay: 'dobDay',
    birthdateMonth: 'dobMonth',
    birthdateYear: 'dobYear'
};

class RegForm {

    private static EMPTY_VALUE: string = '';

    private values: Map<string, string>;
    private errors: Map<string, string>;



    public getValue(name: string): string {
        return (this.values.get(name) || RegForm.EMPTY_VALUE);
    }

    public setError(name: string, message: string) {
        this.errors.set(name, message);
    }

    public getErrorsJSON(): JSON {
        const obje: Object = Object.fromEntries(this.errors);
        const je: JSON = JSON.parse(JSON.stringify(obje));
        return je;
    }

    constructor(req: Request) {
        const formJSON = req.body;
        const formDataJSON = JSON.parse(JSON.stringify(formJSON));

        this.values = new Map(Object.entries(formDataJSON));
        this.errors = new Map();
        for (const pn in ParamNames) {
            let v = this.values.get(pn);
            this.values.set(pn, (v === undefined ? RegForm.EMPTY_VALUE : v.trim()));
            this.errors.set(pn, RegForm.EMPTY_VALUE);
        }
    }
}


export { ParamNames, RegForm };