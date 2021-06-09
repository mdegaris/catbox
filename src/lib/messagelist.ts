import {Message} from './message';

export class MessageList {

    private list: Array<Message>;

    public addMessage(msg: Message) {
        this.list.push(msg);
    }    


    public toStringList() : Array<string> {
        let strList : Array<string> = new Array();

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
    }
}