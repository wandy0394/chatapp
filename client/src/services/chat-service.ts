import {Socket, io} from "socket.io-client"
import { ClientToServerEvents, ServerToClientEvents } from "./types"
// const socket = io("http://localhost:4040")
const socket:Socket<ServerToClientEvents, ClientToServerEvents> = io("http://192.168.0.128:4040")

export {socket}