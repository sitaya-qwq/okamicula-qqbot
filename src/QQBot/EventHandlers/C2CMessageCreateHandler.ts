// src/QQBot/EventHandlers/C2CMessageHandler.ts
import { Payload } from '../Types/BasicTypes';
import { EventHandler } from '../Types/BasicTypes';
import { C2CMessageData } from '../Types/MessageDataTypes/C2CMessageDataType';
import { SendC2CMessage } from "../Utils/SendC2CMessage";

/**
 * 处理私信消息事件 (C2C_MESSAGE_CREATE)
 */
export const HandleC2CMessage: EventHandler<C2CMessageData> = 
    async (payload: Payload, env: Env, ctx: ExecutionContext) => 
    {
        try {
            const { d, id, t } = payload;
            
            
            // 提取消息数据
            const msg: C2CMessageData = (d as C2CMessageData);
            ctx.waitUntil(
                ProcessMessage(msg,env)
            );


            
            // 7. 返回成功状态
            return new Response('OK', { status: 200 });

        } catch (error) {
            console.error('[C2C_MESSAGE_CREATE] 处理异常:', error);
            return new Response('Internal Server Error', { status: 500 });
        }
    };

async function ProcessMessage(msg: C2CMessageData, env: Env) {
    try {
        // ========== 1. 参数校验 ==========
        if (!msg.id) {
            console.error('[ProcessMessage] 缺少 msg.id');
            return;
        }

        const userOpenId = msg.author?.user_openid;
        if (!userOpenId) {
            console.error('[ProcessMessage] 缺少 user_openid，无法回复');
            return;
        }

        const msgId = msg.id;          // ✅ 此时 TS 确认类型为 string
        const content = msg.content;   // string | undefined

        // ========== 2. 业务逻辑 ==========
        let reply = '收到你的消息！';

        if (content) {
            reply = `${content}嗷呜~`;
        }

        await SendC2CMessage(
            userOpenId,  // 用户OpenID
            reply,       // 回复内容
            env,         // 环境变量
            msgId        // 消息ID（被动回复）
        );

        console.log(`[ProcessMessage] 回复已发送: ${reply}`);

    } catch (error) {
        console.error('[ProcessMessage] 处理异常:', error);
    }
}