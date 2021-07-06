import { FIELD_NAMES } from "./formFields";
import { Request } from "express";

/**
 *
 */
class RegForm {
    private static EMPTY_VALUE: string = ""; // Empty form field constant

    private values: Map<string, string>; // Form field values
    private errors: Map<string, string>; // Form field validation errors

    /**
     * Takes a form field name and returns it's currently assigned value.
     *
     * @param name Name of the form field.
     * @returns Form field value.
     */
    public getValue(name: string): string {
        return this.values.get(name) || RegForm.EMPTY_VALUE;
    }

    /**
     * Sets the validation error message for a give form field.
     *
     * @param name Name of the form field.
     * @param message Validation error message.
     */
    public setError(name: string, message: string) {
        this.errors.set(name, message);
    }

    /**
     * Builds a JSON object that maps all form field names,
     * to it's current validation error message (if any).
     *
     * @returns A JSON object containing validation error messages.
     */
    public getErrorsJSON(): JSON {
        const obje: Object = Object.fromEntries(this.errors);
        const je: JSON = JSON.parse(JSON.stringify(obje));
        return je;
    }

    /**
     * Populates a RegForm instance with form data contained within
     * the body of a give HTTP Request object.
     *
     * @constructor
     * @param req HTTP request object.
     */
    constructor(req: Request) {
        // Get form JSON from request body.
        const formJSON = req.body;
        const formDataJSON = JSON.parse(JSON.stringify(formJSON));

        // Populate values and errors maps.
        this.values = new Map(Object.entries(formDataJSON));
        this.errors = new Map();
        for (const pn in FIELD_NAMES) {
            // Init errors map with empty validation error message.
            this.errors.set(pn, RegForm.EMPTY_VALUE);

            // Init values map and convert any undefined values to EMPTY_VALUE.
            let v = this.values.get(pn);
            this.values.set(
                pn,
                v === undefined ? RegForm.EMPTY_VALUE : v.trim()
            );
        }
    }
}

export { RegForm };
