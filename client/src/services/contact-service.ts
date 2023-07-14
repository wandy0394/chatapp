import { Contact } from "../features/ContactList/types/types";
import request, { RESPONSE_TYPE, RequestError } from "./util/request";

const url = (import.meta.env.MODE === 'development')
                            ?'http://192.168.0.128:8080/api/v1/contactList'
                            :'https://app-library-dot-paletto-382422.ts.r.appspot.com/api/v1/contactList'

const headers = {
    "Accept" : "*",
    "Content-Type": "application/json",
};
const credentials = "include";

type User = {
    email:string,
    name:string
    username?:string
    userUUID?:string
}

type ResponseObject<T> = {
    status:string,
    data:T
}

export default class ContactAgent {

    static async addContact(addresseeEmail:string) {
        const config:RequestInit = {
            method:'POST',
            headers:headers,
            credentials:credentials,
            body: JSON.stringify({
                addresseeEmail:addresseeEmail,
            })
        }

        try {
            const response = await request<ResponseObject<User>>(`${url}`, config)
            if (response.status === RESPONSE_TYPE.OK) {
                return response.data
            }
            else if (response.status === RESPONSE_TYPE.ERROR) {
                console.log('error has been returned')
            }
        }
        catch(error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')  
        }
    }

    static async removeContact(addresseeEmail:string) {
        const config:RequestInit = {
            method:'DELETE',
            headers:headers,
            credentials:credentials,
            body: JSON.stringify({
                addresseeEmail:addresseeEmail,
            })
        }

        try {
            const response = await request<ResponseObject<User>>(`${url}`, config)
            if (response.status === RESPONSE_TYPE.OK) {
                return response.data
            }
        }
        catch(error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')  
        }
    }

    static async rejectContactRequest(addresseeEmail:string) {
        const config:RequestInit = {
            method:'DELETE',
            headers:headers,
            credentials:credentials,
            body: JSON.stringify({
                addresseeEmail:addresseeEmail,
            })
        }

        try {
            const response = await request<ResponseObject<User>>(`${url}/request`, config)
            if (response.status === RESPONSE_TYPE.OK) {
                return response.data
            }
        }
        catch(error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')  
        }
    }

    static async getContactList() {
        const config:RequestInit = {
            method:'GET',
            headers:headers,
            credentials:credentials,
        }
        try {
            const response = await request<ResponseObject<Contact[]>>(`${url}`, config)
            if (response.status === RESPONSE_TYPE.OK) {
                return response.data
            }
        }
        catch(error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')  
        }  
    }
}