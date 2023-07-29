export type Conversation = {
    uuid:string,
    label:string[],
    hasUnreadMessages:boolean,
    memberUUIDs:string[],
    memberEmails:string[],
    isTemporary:boolean
}

