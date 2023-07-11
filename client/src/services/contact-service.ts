import { Contact } from "../features/ContactList/types/types";
import request, { RESPONSE_TYPE, RequestError } from "./util/request";

const url = (import.meta.env.MODE === 'development')
                            ?'http://192.168.0.128:8080/api/v1/users/contacts'
                            :'https://app-library-dot-paletto-382422.ts.r.appspot.com/api/v1/users/contacts'

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

    static async addContact(email:string) {
        const config:RequestInit = {
            method:'POST',
            headers:headers,
            credentials:credentials,
            body: JSON.stringify({
                email:email,
            })
        }

        try {
            const response = await request<ResponseObject<User>>(`${url}/addContact`, config)
            if (response.status === RESPONSE_TYPE.OK) {
                return response.data
            }
        }
        catch(error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')  
        }
    }

    static async removeContact(email:string) {
        const config:RequestInit = {
            method:'DELETE',
            headers:headers,
            credentials:credentials,
            body: JSON.stringify({
                email:email,
            })
        }

        try {
            const response = await request<ResponseObject<User>>(`${url}/removeContact`, config)
            if (response.status === RESPONSE_TYPE.OK) {
                return response.data
            }
        }
        catch(error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')  
        }
    }

    static async getContactList(email?:string) {
        const config:RequestInit = {
            method:'GET',
            headers:headers,
            credentials:credentials,
        }
        try {
            const response = await request<ResponseObject<Contact[]>>(`${url}/getContactList`, config)
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