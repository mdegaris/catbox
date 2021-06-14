import {Message} from './message';

export class MessageList {

    private list : Array<Message>;
    private latestMessageTime : Date|null;


    public getLastMessageTime() : Date|null {
        return this.latestMessageTime;
    }

    public addMessage(msg: Message) {
        this.latestMessageTime = msg.getTimestamp();
        this.list.push(msg);
    }    

    public toStringList() : Array<string> {
        let strList : Array<string> = new Array<string>();

        for (let m of this.list) {
            strList.push(m.getText());
        }

        return strList;
    }

    public toJSON() : string {
        return JSON.stringify(this.toStringList());
    }

    constructor() {
        this.list = new Array();
        this.latestMessageTime = null;
    }
}