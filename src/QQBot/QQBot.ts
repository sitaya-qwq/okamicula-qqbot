// src/QQBot/QQBot.ts
import { Payload, OperateCode } from './Types/QQBotTypes/BasicTypes';
import { ValidationEvent } from './EventHandlers/ValidationEvent';
import { EventHandlerFactory } from './EventHandlers/EventFactory';
import { BaseEvent } from './EventHandlers/Event';


/**
 * 处理 QQ 机器人的回调请求
 */
export async function HandleQQBotRequest(
    payload: Payload,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> 
{
    console.log(`[QQBot] 收到请求, op: ${payload.op}, t: ${payload.t || 'N/A'}`);

    // 1. 处理 URL 验证 (op=13)
    if (payload.op === OperateCode.URLValidation) 
    {       
        return new ValidationEvent(payload,env,ctx).Handle();;
    }

    // 2. 处理心跳确认 (op=11)
    if (payload.op === OperateCode.HeartbeatACK) 
    {
        console.log('[QQBot] 心跳确认');
        return new Response('OK', { status: 200 });
    }

    // 3. 处理事件分发 (op=0)
    if (payload.op === OperateCode.Dispatch && payload.t) 
    {
        const event:BaseEvent = EventHandlerFactory.create(
            payload,
            ctx,
            env
        );

        if (event) {
            return await event.Handle();
        }
        
        console.warn(`[QQBot] 未注册的事件类型: ${payload.t}`);
        return new Response('Event not handled', { status: 200 });
    }

    // 4. 未知操作码
    console.warn(`[QQBot] 未知操作码: ${payload.op}`);
    return new Response('Unknown op code', { status: 400 });
}