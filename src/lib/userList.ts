import { User } from "./user";


export class UserList {

    private userList: Array<User>;


    public containsUser(u: User) {
        if (this.userList.find((fu) => { fu.equals(u) })) {
            return true;
        } else {
            return false;
        }
    }

    public addUser(u: User) {
        if (this.containsUser(u)) {
            return false;
        } else {
            this.userList.push(u);
            return true;
        }
    }

    public removeUser(u: User) {
        if (this.containsUser(u)) {
            this.userList = 
                this.userList.filter((u) => {
                    return (u.getUsername() != u.getUsername());
                });

            return true;
        } else {
            return false;
        }
    }

    public getAllUsers(): Array<User> {
        return this.userList;
    }


    constructor() {
        this.userList = new Array<User>();
    }
}