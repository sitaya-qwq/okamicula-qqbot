export class QQBotAPIError extends Error{
    private readonly message_: string;

    public constructor(message: string) {
        super(`QQBOT-API ${message}`);
        Object.setPrototypeOf(this, QQBotAPIError.prototype);
        this.message_ = message;
    }

    
    public GetMessage() : string {return this.message_;}
}