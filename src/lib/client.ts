import {Message} from './message';

enum ClientStatus {
    Active = 0,
    Inactive = 1,
  }


export class Client {

    private static ACTIVITY_TIME_THRESHOLD : number = 600_000;

    private username: string;
    private ipAddress: string;
    private timeJoined: Date;
    private timeLastMessage: Date;
    private activeStatus: ClientStatus;

    public getUsername(): string {
        return this.username;
    }

    public getIpAddress(): string {
        return this.ipAddress;
    }

    public getTimeJoined(): Date {
        return this.timeJoined;
    }

    public receiveMessage(m: Message) {

    }

    public validateActivity() {
        let currentDate = new Date();
        let inactivityTimeMS = (currentDate.getTime() - this.timeLastMessage.getTime());
        if (inactivityTimeMS > Client.ACTIVITY_TIME_THRESHOLD) {
            this.activeStatus = ClientStatus.Inactive;
        }
    }

    constructor(un: string, ip: string, d: Date) {
        this.username = un;
        this.ipAddress = ip;
        this.timeJoined = d;
        this.activeStatus = ClientStatus.Active;
        this.timeLastMessage = new Date();
    }
}

