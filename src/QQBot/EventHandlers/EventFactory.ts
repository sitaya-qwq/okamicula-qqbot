// handlers/MessageHandlerFactory.ts
import { Payload } from '../Types/BasicTypes';
import { C2CMessageCreateEvent } from './MessageCreateEvents/C2CMessageCreateEvent';
import { GroupAtMessageCreateEvent } from './MessageCreateEvents/GroupAtMessageCreateEvent';

// ... 其他 Handler

export class EventHandlerFactory {
    static create(payload: Payload, ctx: ExecutionContext, env: any) {
        switch (payload.t) {
            case "C2C_MESSAGE_CREATE":
                return new C2CMessageCreateEvent(payload,env,ctx);
            case "GROUP_AT_MESSAGE_CREATE":
                return new GroupAtMessageCreateEvent(payload, env, ctx);
            default:
                throw new Error(`Unsupported event type: ${payload.t}`);
        }
    }
}