import { Payload } from "../../Types/QQBot/Payload";

export abstract class BaseEvent<T = any> {
    protected readonly payload_: Payload;
    protected readonly env_: Env;
    protected readonly ctx_: ExecutionContext;
    protected readonly data_: T;

    public constructor(payload: Payload, env: Env, ctx: ExecutionContext) {
        this.payload_ = payload;
        this.env_ = env;
        this.ctx_ = ctx;
        this.data_ = payload.d as T;
    }

    
    abstract Handle(): Promise<Response>;
       
}