export class QQBotOpenAPIError extends Error{
    private readonly errorCode_: number;
    private readonly message_: string;
    private readonly traceID_: string;

    public constructor(error_code: number, message: string, trace_id: string) {
        super(`QQBOT-OPENAPI ${error_code}: ${message} (${trace_id})`);
        Object.setPrototypeOf(this, QQBotOpenAPIError.prototype);
        this.errorCode_ = error_code;
        this.message_ = message;
        this.traceID_ = trace_id;
    }

    
    public GetErrorCode() : number {return this.errorCode_;}
    public GetMessage() : string {return this.message_;}
    public GetTraceID() : string {return this.traceID_;}
}