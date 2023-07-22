import {Socket} from 'socket.io'
import ClientService from '../../services/clientService'


const clientListener = (socket:Socket) => {
    const user = socket.request.user
    if (user === null || user === undefined) return
    console.log('Registration listener')
    console.log('user email is ' + user.email)
    console.log('socketId is ' + socket.id)

    if (!ClientService.registerClient(user.userUUID, user.email, socket.id, user.sessionID)) {
        ClientService.updateClientSocketId(user.sessionID, socket.id)
    }

}

export default clientListener