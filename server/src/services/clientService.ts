type ClientData = {
    socketId:string,
    userUUID:string,
    email:string
}

type ClientMap = {
    [sessionId:string]: ClientData
}

let clients:ClientMap = {}

class ClientService {

    static isClientRegistered(userUUID:string, email:string): boolean {
        return Object.values(clients).find((client) => {
        return client.userUUID === userUUID && client.email===email
        }) !== undefined
    } 

    //find all clients associated with a registerd user/client
    static getRegisteredClients(userUUID:string, email:string):ClientData[] {
        const clientData:ClientData[] = []
        Object.values(clients).forEach(client=>{
            if (client.userUUID === userUUID && client.email === email) {
                clientData.push({
                    email:client.email,
                    userUUID:client.userUUID,
                    socketId:client.socketId
                })
            }
        })
        return clientData
    }

    //typically used when client logs in
    static registerClient(userUUID:string, email:string, socketId:string, sessionId:string):boolean {
        //TODO: should return SUCCESS or FAIL
        if (!(sessionId in clients)) {
            //sessionId already registered
            clients[sessionId] = {
                socketId:socketId,
                userUUID: userUUID,
                email:email
            }
            console.log(clients)
            return true
        }            

        return false
    }

    //handle case where sessionId is destroyed, typically by logging out
    static unregisterClient(sessionId:string) {
        if (sessionId in clients) {
            delete clients[sessionId]
            console.log(clients)

        }
    }

    //for case where user with the same cookie (=sessionId) refreshes their client
    static updateClientSocketId(sessionId:string, socketId:string) {
        if (sessionId in clients) {
            clients[sessionId].socketId = socketId
            console.log(clients)
        }
    }

    static getSocketIdsByEmail(email:string):string[] {
        const output:string[] = []
        Object.values(clients).forEach(client=>{
            if (client.email === email) output.push(client.socketId)
        })
        return output
    }

}

export default ClientService