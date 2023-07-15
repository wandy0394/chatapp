import { Message } from "../features/ChatMessages/types";
import { webSocket as socket } from "./util/socket";

export class ChatService {
    static listenOnMessage(callback:(msg:Message)=>void) {
        socket.on("message", callback)
    }

    static removeMessageListener(callback:any) {
        socket.off("message", callback)
    }

}


