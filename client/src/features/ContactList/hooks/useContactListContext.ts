import {useContext} from 'react'
import { ContactListContext } from '../context/ContactListContext'

export const useContactListContext = () => {
    const context = useContext(ContactListContext)
    if (!context) {
        throw Error('useContactListContext cannot be used outside an ContactListContextProvider')
    }
    return context
}