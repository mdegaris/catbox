import { Config } from '../conf/config';
import { MessageList } from './messagelist';


const NON_IP = 'xx.xx.xx.xx';

enum ReservedUsername {
    UNDEFINED = '[Undefined]',
    SYSTEM = '[System]',
    TEST = '__testuser__'
}

export class User {

    public static readonly SYSTEM_USER: User
                        = User.createSpecialUser(ReservedUsername.SYSTEM);

    public static readonly UNDEFINED_USER: User
                        = User.createSpecialUser(ReservedUsername.UNDEFINED);

    public static readonly TEST_USER: User
                        = User.createSpecialUser(ReservedUsername.TEST);

    static createSpecialUser(un: string): User {
        return new User(un, NON_IP, new Date());
    }

    private username: string;
    private ipAddress: string;
    private timeJoined: Date;
    private messageList: MessageList;


    public equals(u: User) {
        return (u.getUsername() === this.username);
    }

    public getUsername(): string {
        return this.username;
    }

    public getIpAddress(): string {
        return this.ipAddress;
    }

    public setTimeJoined(d: Date) {
        this.timeJoined = d;
    }

    public getTimeJoined(): Date {
        return this.timeJoined;
    }

    public lastActivityTime(): Date {
        let msglLastAct = this.messageList.getLastMessageTime();
        return (msglLastAct === null || this.timeJoined > msglLastAct) ?
            this.timeJoined : msglLastAct;
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
        let json = {
            username: this.username,
            ipAddress: this.ipAddress,
            timeJoined: this.timeJoined.getTime().toString()
        };

        return JSON.stringify(json);
    }

    constructor(un: string, ip: string, dt: Date) {
        this.username = un;
        this.ipAddress = ip;
        this.timeJoined = dt;
        this.messageList = new MessageList();
    }
}

