import { GroupMessageData } from "../../Types/QQBotTypes/MessageDataTypes/ReceiveMessageData/GroupMessageDataType";
import { SendGroupAtMessageData } from "../../Types/QQBotTypes/MessageDataTypes/SendMessageData/SendGroupMessageDataType";
import { SendMessageData } from "../../Types/QQBotTypes/MessageDataTypes/SendMessageData/SendMessageDataType";
import { UploadMediaRequest, UploadMediaResponse } from "../../Types/QQBotTypes/MessageDataTypes/UploadMediaTypes";
import { GetAccessToken, ClearTokenCache } from "../../Utils/AccessToken";
import { MessageCreateEvent } from "./MessageCreateEvent";

/**
 * 处理私信消息事件 (C2C_MESSAGE_CREATE)
 */
export class GroupAtMessageCreateEvent extends MessageCreateEvent {
    protected async UploadMedia(body: UploadMediaRequest): Promise<UploadMediaResponse> {
        const group_openid: string = (this._data as GroupMessageData).group_openid;
        const url = `${this._env.QQBOT_URL}/groups/${group_openid}/files`;
        const accessToken = await GetAccessToken(this._env);

        if (!accessToken) {
            throw new Error("Invalid AccessToken!")
        }

        const res: Response = await fetch(url,{
            method:"POST",
            headers:{
                "Authorization": `QQBot ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (res.status !== 200) {
            console.error("Failed to upload a media!");
            throw new Error("Failed to upload a media");
        }

        console.log("Succeed to upload a media");

        const data: UploadMediaResponse = await res.json();
        return data
    }

    protected override async GetSendMessageData(): Promise<SendMessageData> {
        try {
            const userMsg: GroupMessageData = this._data as GroupMessageData;
    
            let replyMsg: SendMessageData = {
                msg_id: userMsg.id,
                content: userMsg.content
            }
            return super.GetSendMessageData(replyMsg);
        }catch(error){
            console.error(error);
            throw error;
        } 
    }


    protected async PostMessage(openid: string, reply_msg: SendMessageData): Promise<void> {
        try {
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
                body: JSON.stringify(reply_msg)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[SendGroupAtMessage] 发送失败: ${response.status}`, errorText, reply_msg);

                if (response.status === 401) {
                    console.warn('[SendGroupAtMessage] Token 已过期，清除缓存');
                    ClearTokenCache();
                }
                return;
            }       
            const result = await response.json();
            console.log(`[SendGroupAtMessage] 消息发送成功: ${reply_msg.msg_id || 'N/A'}`, result);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async Handle(): Promise<Response> {
        let replyMsg: SendGroupAtMessageData = (await this.GetSendMessageData()) as SendGroupAtMessageData;
        replyMsg.msg_id = this._data.id;

        this._ctx.waitUntil(this.PostMessage((this._data as GroupMessageData).group_openid,replyMsg));

        return new Response('OK', { status: 200 });
    }
}