export class RequestError extends Error {
    status?:string
    code?:number
    constructor(message:string, status?:string, code?:number) {
        super(message)
        this.status = status
        this.code = code
    }
}

export const RESPONSE_TYPE = {
    ERROR:'error',
    OK:'ok'
}



export default async function request<TResponse>(url: string, config: RequestInit = {}): Promise<TResponse> {
    try {
        const response = await fetch(url, config)
        if (!response.ok) {
            const errorResponse = await response.json()
            const error: RequestError = new RequestError(errorResponse.data.error, errorResponse.status, response.status)
            throw error
        }
        const data = await response.json() as TResponse
        return data
    } 
    catch (error) {
        console.error(error)
        // Handle network errors
        if (error instanceof TypeError) throw new RequestError('Network Error', RESPONSE_TYPE.ERROR)
            
        // Handle custom errors thrown from API
        if (error instanceof RequestError) throw error

        //Handle indeterminite errors
        if (error instanceof Error) throw new RequestError(error.message, RESPONSE_TYPE.ERROR)
        
        //Handle cases where an Error object is not caught
        throw new RequestError('Unknown Error', RESPONSE_TYPE.ERROR)
    }
}