import socketio from "socket.io";

import { Config } from "./conf/config";
import { catboxApp, httpServer, socketServer } from "./create-app-objs";
import { Message } from "./lib/chat/message";
import { ChatRoom } from "./lib/chat/chatRoom";
import { User } from "./lib/user/user";
import { UserProfile } from "./lib/user/userProfile";
import { setupRouter } from "./router";

// =================================================================

setupRouter(catboxApp);

// =================================================================

let SOCKET_USER_MAP = new Map();
let IP_USER_MAP = new Map();
const defaultChatroom = new ChatRoom(Config.DEFAULT_CHATROOM_NAME);

// =================================================================

/**
 *
 * @param socket
 */
function initHandler(socket: socketio.Socket) {
    let recentMsgJSON = defaultChatroom.getMessageList().toJSON();
    console.log("Initialise messages...");
    socket.emit("load-recent-chat", recentMsgJSON);
}

// =================================================================

/**
 *
 * @param msg
 * @param socket
 */
function chatHandler(msg: string, socket: socketio.Socket) {
    console.log(`Received message: ${msg}`);

    let user = SOCKET_USER_MAP.get(socket.id);
    let newMsg = new Message(msg, new Date(), user);
    defaultChatroom.getMessageList().addMessage(newMsg);
    socketServer.emit("chat-message", newMsg.getText());
}

// =================================================================

/**
 *
 * @param username
 * @param socket
 */
function userJoinHandler(username: string, socket: socketio.Socket) {
    let newUser = new User(
        username,
        UserProfile.TEST,
        "tespw",
        socket.handshake.address,
        new Date()
    );
    defaultChatroom.getUserList().addUser(newUser);

    SOCKET_USER_MAP.set(socket.id, newUser);
    IP_USER_MAP.set(newUser.getIpAddress(), newUser);

    console.log(`Received join-request new user: ${newUser.toString()}`);
    socket.emit("load-chat");

    let joinedMsg = new Message(
        `${username} has joined the chat.`,
        new Date(),
        User.SYSTEM_USER
    );
    socketServer.emit("system-message", joinedMsg.getText());
}

// =================================================================

/**
 *
 * @param user
 * @param socket
 */
function rejoin(user: User, socket: socketio.Socket) {
    user.setLoginTime(new Date());
    SOCKET_USER_MAP.set(socket.id, user);

    console.log(`User rejoined: ${user.toString()}`);

    let joinedMsg = new Message(
        `${user.getUserProfile().getUsername()} has rejoined the chat.`,
        new Date(),
        User.SYSTEM_USER
    );
    socketServer.emit("system-message", joinedMsg.getText());
}

// =================================================================

/**
 *
 * @param reason
 */
function disconnectHandler(reason: string) {
    console.log(`User disconnected. ${reason}`);
}

// =================================================================

/**
 *
 * @param socket
 */
function bootstrapHandler(socket: socketio.Socket) {
    const addr = socket.handshake.address;

    console.log(`Bootstrap chat. Socket ID: ${socket.id}, Addr: ${addr}`);

    if (IP_USER_MAP.has(addr)) {
        rejoin(IP_USER_MAP.get(addr), socket);
        socket.emit("load-chat");
    } else {
        socket.emit("load-join");
    }
}

// =================================================================

socketServer.on("connection", (socket) => {
    console.log(`Client connected. Socket ID: ${socket.id}`);

    socket.on("bootstrap", () => {
        bootstrapHandler(socket);
    });

    socket.on("disconnect", disconnectHandler);
    socket.on("chat-message", (msg) => {
        chatHandler(msg, socket);
    });
    socket.on("join-request", (user) => {
        userJoinHandler(user, socket);
    });
    socket.on("init-chat", () => {
        initHandler(socket);
    });
});

// =================================================================

httpServer.listen(Config.PORT, () => {
    console.log(`Listening on *: ${Config.PORT}`);
});
