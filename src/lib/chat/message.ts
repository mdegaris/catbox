import { User } from "../user/user";

class Message {

    private text: string;
    private timestamp: Date;
    private user: User;

    public getText(): string {
        return `${this.user.getUserProfile().getUsername()} : ${this.text}`;
    }

    public getTimestamp(): Date {
        return this.timestamp;
    }

    public getUser(): User {
        return this.user;
    }

    constructor(txt: string, ts: Date, usr: User) {
        this.text = txt;
        this.timestamp = ts;
        this.user = usr;
    }
}

export { Message };