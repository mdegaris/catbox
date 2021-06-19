import crypto from 'crypto';

class Registration {    

    // Static

    private static readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    private static doHash(pw: string): string {
        const shaHash256 = crypto.createHash('sha256');
        shaHash256.update(pw, 'utf8');
        return shaHash256.digest('hex');
    }

    public static validatePassword(pw: string): boolean {
        return Registration.PASSWORD_REGEX.test(pw);
    }

    // Instanced

    private email: string;
    private hashedPassword: string;

    public getEmail(): string {
        return this.email;
    }

    public getHashedPassword(): string {
        return this.hashedPassword;
    }

    constructor(em: string, pw: string) {
        this.email = em;
        this.hashedPassword = Registration.doHash(pw);
    }
}

export { Registration };
