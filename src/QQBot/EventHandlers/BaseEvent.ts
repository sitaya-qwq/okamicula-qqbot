import { Payload } from "../Types/QQBotTypes/BasicTypes";

export abstract class BaseEvent<T = any> {
    protected readonly _payload: Payload;
    protected readonly _ctx: ExecutionContext;
    protected readonly _data: T;
    public constructor(payload: Payload, ctx: ExecutionContext) {
        this._payload = payload;
        this._ctx = ctx;
        this._data = payload.d as T;
    }

    
    abstract Handle(): Promise<Response>;
       
}