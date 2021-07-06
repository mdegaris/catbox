import argon2, { argon2id } from "argon2";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

/**
 * Hash a give plain password string.
 *
 * @param pw Password string
 * @returns Hashed password string
 */
async function hashPassword(pw: string): Promise<string> {
    return await argon2.hash(pw, { type: argon2id });
}

/**
 *
 * @param plainPassword
 * @param hashedPassword
 * @returns true/false
 */
async function hashCompare(
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> {
    return await argon2.verify(hashedPassword, plainPassword, {
        type: argon2id,
    });
}

function validPassword(pw: string): boolean {
    return PASSWORD_REGEX.test(pw);
}

export { hashPassword, hashCompare, validPassword };
