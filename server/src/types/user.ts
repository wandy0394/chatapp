export type User = {
    username:string,
    email:string,
    userUUID:string,
    passwordHash?:string,
    id:number
}

export type Contact = {
    username:string,
    email:string,
    userUUID:string,
    status:string
}