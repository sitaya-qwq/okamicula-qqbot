import { Payload } from "../Types/BasicTypes";

export abstract class BaseEvent<T = any> {
    protected readonly _payload: Payload;
    protected readonly _env: Env;
    protected readonly _ctx: ExecutionContext;
    protected readonly _data: T;
    public constructor(payload: Payload, env: Env, ctx: ExecutionContext) {
        this._payload = payload;
        this._env = env;
        this._ctx = ctx;
        this._data = payload.d as T;
    }

    
    abstract Handle(): Promise<Response>;
       
}