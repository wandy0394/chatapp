import ContactAgent, { User } from "../../../services/contact-service";

type MessageData = {
    [key:string]:string
}

export abstract class Notification {
    private message:string = '';
    private messageData:MessageData
    protected abstract type:string;
    /**
     *
    */
   constructor(messageEvent:MessageEvent) {
       this.messageData = {...JSON.parse(messageEvent.data)}
       this.message = this.messageData.message
    }
    
    public getMessage() {
        return this.message
    }
    
    public getType() {
        return this.type
    }
    
    public getMessageData() {
        return this.messageData
    }

    
    public abstract isAcknowledegable():boolean
    
    public abstract isRejectable():boolean 
    
    public abstract isAccpetable():boolean 

    public abstract acceptAsync():Promise<any>
    public abstract accept():void

    public abstract reject():void
    
    public abstract acknowledge():void
    
}

export class ContactRequestNotification extends Notification {
    
    protected type: string;
    /**
     *
     */

    constructor(messageEvent:MessageEvent) {
        super(messageEvent);
        this.type='Contact Request'
    }

    public isAcknowledegable():boolean {
        return false
    }

    public isAccpetable(): boolean {
        return true
    }

    public isRejectable(): boolean {
        return true
    }
    public async acceptAsync(): Promise<User|undefined> {
        console.log('accept')
        // ContactAgent.acceptContactRequest(this.getMessageData().from)
        //     .then(()=>{
        //         console.log('success')
        //     } )
        //     .catch(()=>{
        //         console.log('fail')
        //     })
        // this.clearNotification()
        return ContactAgent.acceptContactRequest(this.getMessageData().from)
    }

    public accept():void {
        Function.prototype()
    }

    public reject(): void {
        console.log('reject')
        ContactAgent.rejectContactRequest(this.getMessageData().from)
            .then(()=>{
                console.log('rejected success')
            })
            .catch(()=>{
                console.log('could not reject')
            })
        // this.clearNotification()
    }
    public acknowledge(): void {
        //do nothing
        Function.prototype()
    }
}

export class MessageNotification extends Notification {
    protected type: string;
    constructor(messageEvent:MessageEvent) {
        super(messageEvent);
        this.type='Message'
    }
    public isAcknowledegable(): boolean {
        return true
    }
    public isRejectable(): boolean {
        return false
    }
    public isAccpetable(): boolean {
        return false
    }
    public accept(): void {
        //do nothing
        Function.prototype()
    }

    public async acceptAsync(): Promise<void> {
        return Promise.resolve()
    }
    public reject(): void {
        //do nothing
        Function.prototype()
    }
    public acknowledge(): void {
        //send ack to server
    }
}