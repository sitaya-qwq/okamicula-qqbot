// src/QQBot/EventHandlers/C2CMessageHandler.ts
import { Payload } from '../Types/BasicTypes';
import { EventHandler } from '../Types/BasicTypes';
import { C2CMessageData } from '../Types/MessageDataTypes/C2CMessageDataType';
import { GroupMessageData } from '../Types/MessageDataTypes/GroupMessageDataTypes';
import { SendGroupMessage } from '../Utils/SendGroupMessage';

/**
 * 处理私信消息事件 (GROUP_AT_MESSAGE_CREATE)
 */
export const HandleGroupAtMessage: EventHandler<C2CMessageData> = 
    async (payload: Payload, env: Env, ctx: ExecutionContext) => 
    {
        try {
            const { d, id, t } = payload;
            
            
            // 提取消息数据
            const msg: GroupMessageData = (d as GroupMessageData);
            ctx.waitUntil(
                ProcessMessage(msg,env)
            );
            
            // 7. 返回成功状态
            return new Response('OK', { status: 200 });

        } catch (error) {
            console.error('[GROUP_AT_MESSAGE_CREATE] 处理异常:', error);
            return new Response('Internal Server Error', { status: 500 });
        }
    };

async function ProcessMessage(msg: GroupMessageData, env: Env) {
    try {
        // ========== 1. 参数校验 ==========
        if (!msg.id) {
            console.error('[GroupAtProcessMessage] 缺少 msg.id');
            return;
        }

        const groupOpenID = msg.group_openid;
        if (!groupOpenID) {
            console.error('[GroupAtProcessMessage] 缺少 groupOpenID，无法回复');
            return;
        }

        const msgId = msg.id;          // ✅ 此时 TS 确认类型为 string
        const content = msg.content;   // string | undefined

        // ========== 2. 业务逻辑 ==========

        let reply: string = `${content}嗷呜~`;

        

        await SendGroupMessage(
            groupOpenID,  // 群OpenID
            reply,       // 回复内容
            env,         // 环境变量
            msgId        // 消息ID（被动回复）
        );

        console.log(`[GroupAtProcessMessage] 回复已发送: ${reply}`);

    } catch (error) {
        console.error('[GroupAtProcessMessage] 处理异常:', error);
    }
}