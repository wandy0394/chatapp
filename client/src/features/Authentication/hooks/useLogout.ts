import { ACTION_TYPES } from "../AuthContext"
import Authenticator from "../../../services/authentication-service"
import { useAuthContext } from "./useAuthContext"

export function useLogout() {
    const {dispatch} = useAuthContext()

    async function logout() {
        //remove user from storage
        // sessionStorage.removeItem('user')
        try {
            const result = await Authenticator.logout()
            if (dispatch) dispatch({type:ACTION_TYPES.LOGOUT, payload:null})
        }
        catch(e) {
            //handle error
        }
    }

    return {logout}
}