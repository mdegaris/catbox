
enum ReservedUsername {
    SYSTEM = '[System]',
    TEST = '[TestUser]'
}


class UserProfile {

    // Static

    public static readonly SYSTEM: UserProfile
        = UserProfile.createSpecialUserProfile(ReservedUsername.SYSTEM);

    public static readonly TEST: UserProfile
        = UserProfile.createSpecialUserProfile(ReservedUsername.TEST);

    static createSpecialUserProfile(un: string): UserProfile {
        return new UserProfile(un);
    }


    // Instanced

    private username: string;


    public equals(un: UserProfile) {
        return (un.getUsername() === this.username);
    }

    public getUsername(): string {
        return this.username;
    }

    public toString(): string {
        let json = {
            username: this.username
        };

        return JSON.stringify(json);
    }


    constructor(un: string) {
        this.username = un;
    }
}

export { UserProfile };