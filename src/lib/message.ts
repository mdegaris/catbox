export class Message {

    private text: string;
    private timestamp: Date;

    public getText(): string {
        return this.text;
    }    

    public getTimestamp(): Date {
        return this.timestamp;
    }

    constructor(txt: string, ts: Date) {
        this.text = txt;
        this.timestamp = ts;
    }
}