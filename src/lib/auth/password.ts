import argon2, { argon2id } from 'argon2';


/**
 * Hash a give plain password string.
 *
 * @param pw Password string
 * @returns Hashed password string
 */
async function hashPassword(pw: string): Promise<string> {
    return await argon2.hash(pw, {type: argon2id});
}

/**
 *
 * @param plainPassword
 * @param hashedPassword
 * @returns true/false
 */
async function hashCompare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await argon2.verify(hashedPassword, plainPassword, {type: argon2id});

    argon2.verify
}

export {hashPassword, hashCompare};