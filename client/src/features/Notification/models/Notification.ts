import ContactAgent from "../../../services/contact-service";
import useGetContacts from "../../ContactList/hooks/useGetContacts";

type MessageData = {
    [key:string]:string
}

export abstract class Notification {
    private message:string = '';
    private messageData:MessageData
    protected abstract type:string;
    private removeNotificationCallback:(id:string) => void
    /**
     *
     */
    constructor(messageEvent:MessageEvent, removeNotificationCallback:(id:string)=>void) {
        this.messageData = {...JSON.parse(messageEvent.data)}
        this.message = this.messageData.message
        this.removeNotificationCallback = removeNotificationCallback
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

    protected clearNotification() {
        this.removeNotificationCallback(this.messageData.id)
    }

    public abstract isAcknowledegable():boolean

    public abstract isRejectable():boolean 

    public abstract isAccpetable():boolean 

    public abstract accept():void

    public abstract reject():void

    public abstract acknowledge():void
    
    
}

export class ContactRequestNotification extends Notification {

    protected type: string;
    /**
     *
     */

    constructor(messageEvent:MessageEvent, removeNotification:(id:string)=>void) {
        super(messageEvent, removeNotification);
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
    public accept(): void {
        console.log('accept')
        ContactAgent.acceptContactRequest(this.getMessageData().from)
            .then((response) =>{
                console.log('success')
                this.clearNotification()
            } )
            .catch(response=>{
                console.log('fail')
            })
    }
    public reject(): void {
        console.log('reject')
        ContactAgent.rejectContactRequest(this.getMessageData().from)
            .then(()=>{
                console.log('rejected success')
                this.clearNotification()
            })
            .catch(()=>{
                console.log('could not reject')
            })

    }
    public acknowledge(): void {
        //do nothing
        Function.prototype()
    }
}

export class MessageNotification extends Notification {
    protected type: string;
    constructor(messageEvent:MessageEvent, removeNotification:(id:string)=>void) {
        super(messageEvent, removeNotification);
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
    public reject(): void {
        //do nothing
        Function.prototype()
    }
    public acknowledge(): void {
        //send ack to server
        this.clearNotification()
    }
}