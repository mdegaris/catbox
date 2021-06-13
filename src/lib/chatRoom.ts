import { MessageList } from "./messagelist";
import { UserList } from "./userList";


export class ChatRoom {

    private roomName: string;
    private userList: UserList;
    private messageList: MessageList;


    public getMessageList(): MessageList {
        return this.messageList;
    }

    public getUserList(): UserList {
        return this.userList;
    }

    public getRoomName(): string {
        return this.roomName;
    }


    constructor(rn: string) {
        this.roomName = rn;
        this.userList = new UserList();
        this.messageList = new MessageList();
    }
}