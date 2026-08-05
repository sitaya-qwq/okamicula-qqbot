import { GroupMessageData } from "../../Types/MessageDataTypes/ReceiveMessageData/GroupMessageDataType";
import { SendGroupAtMessageData } from "../../Types/MessageDataTypes/SendMessageData/SendGroupMessageDataType";
import { SendMessageData } from "../../Types/MessageDataTypes/SendMessageData/SendMessageDataType";
import { GetAccessToken, ClearTokenCache } from "../../Utils/AccessToken";
import { MessageCreateEvent } from "./MessageCreateEvent";

/**
 * 处理私信消息事件 (C2C_MESSAGE_CREATE)
 */
export class GroupAtMessageCreateEvent extends MessageCreateEvent {

    protected override async GetSendMessageData(): Promise<SendMessageData> {
        try {
            const userMsg: GroupMessageData = this._data as GroupMessageData;
    
            let replyMsg: SendMessageData = {
                msg_id: userMsg.id,
                content: await this.FetchReply(userMsg.content,userMsg.group_openid)
            }
            return super.GetSendMessageData(replyMsg);
        }catch(error){
            console.error(error);
            throw error;
        } 
    }


    protected async PostMessage(openid: string): Promise<void> {
        try {
            let replyMsg: SendGroupAtMessageData = (await this.GetSendMessageData()) as SendGroupAtMessageData;
            replyMsg.msg_id = this._data.id;

            const url: string = `${this._env.QQBOT_URL}/groups/${openid}/messages`;
            const accessToken = await GetAccessToken(this._env);

            if (!accessToken) {
                throw new Error("Invalid AccessToken!")
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `QQBot ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(replyMsg)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[SendGroupAtMessage] 发送失败: ${response.status}`, errorText, replyMsg);

                if (response.status === 401) {
                    console.warn('[SendGroupAtMessage] Token 已过期，清除缓存');
                    ClearTokenCache();
                }
                return;
            }       
            const result = await response.json();
            console.log(`[SendGroupAtMessage] 消息发送成功: ${replyMsg.msg_id || 'N/A'}`, result);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async Handle(): Promise<Response> {
        this._ctx.waitUntil(this.PostMessage((this._data as GroupMessageData).group_openid));

        return new Response('OK', { status: 200 });
    }
}