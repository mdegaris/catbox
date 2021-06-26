import { Config } from '../../conf/config';
import { MessageList } from '../chat/messagelist';
import { UserProfile } from './userProfile';


const NON_IP = 'xx.xx.xx.xx';
const NON_PW = 'xxxxxxxxxxx';

enum ReservedEmail {
    SYSTEM = 'admin@catbox.degaris.uk',
    TEST = 'test@catbox.degaris.uk'
}

class User {

    public static readonly SYSTEM_USER: User
        = User.createSpecialUser(ReservedEmail.SYSTEM, UserProfile.SYSTEM);

    public static readonly TEST_USER: User
        = User.createSpecialUser(ReservedEmail.TEST, UserProfile.TEST);

    static createSpecialUser(em: string, up: UserProfile): User {
        return new User(em, up, NON_PW, NON_IP, new Date());
    }

    private email: string;
    private passwordHash: string;
    private ipAddress: string;
    private loginTime: Date;
    private messageList: MessageList;
    private userProfile: UserProfile;


    public equals(u: User) {
        return (u.getEmail() === this.email);
    }

    public getEmail(): string {
        return this.email;
    }

    public getIpAddress(): string {
        return this.ipAddress;
    }

    public getPasswordHash(): string {
        return this.passwordHash;
    }

    public setUserProfile(up: UserProfile) {
        return this.userProfile = up;
    }

    public getUserProfile(): UserProfile {
        return this.userProfile;
    }

    public getLoginTime(): Date {
        return this.loginTime;
    }

    public setLoginTime(lt: Date) {
        this.loginTime = lt;
    }

    public lastActivityTime(): Date {
        let msglLastAct = this.messageList.getLastMessageTime();
        return (msglLastAct === null || this.loginTime > msglLastAct) ?
            this.loginTime : msglLastAct;
    }


    public isActive(): boolean {
        let inactivityTimeMins = ((new Date()).getTime() - this.lastActivityTime().getTime())
            / 1000;
        if (inactivityTimeMins > Config.USER_TIMEOUT_MINS) {
            return false;
        } else {
            return true;
        }
    }

    public toString(): string {
        const upStr = this.userProfile ? this.userProfile.toString() : String(this.userProfile);
        let json = {
            userProfile: upStr,
            ipAddress: this.ipAddress,
            loginTime: this.loginTime.getTime().toString()
        };

        return JSON.stringify(json);
    }

    constructor(em: string, up: UserProfile, pwh: string, ip: string, dt: Date) {
        this.email = em;
        this.passwordHash = pwh;
        this.ipAddress = ip;
        this.loginTime = dt;
        this.messageList = new MessageList();

        this.userProfile = up;
    }
}

export { User };