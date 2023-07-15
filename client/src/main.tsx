import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthContextProvider } from './features/Authentication/AuthContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ContactListContextProvider } from './features/ContactList/context/ContactListContext.tsx'
import { ConversationContextProvider } from './features/Conversations/context/ConversationContext.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ContactListContextProvider>
        <ConversationContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ConversationContextProvider>
      </ContactListContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
