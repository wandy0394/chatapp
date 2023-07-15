import {useContext} from 'react'
import { ConversationContext } from '../context/ConversationContext'

export const useConversationContext = () => {
    const context = useContext(ConversationContext)
    if (!context) {
        throw Error('useConversationContext cannot be used outside a ConversationContextProvider')
    }
    return context
}