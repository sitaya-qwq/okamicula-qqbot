import { error } from "node:console";
import { C2CMessageData } from "../../Types/MessageDataTypes/ReceiveMessageData/C2CMessageDataType";
import { SendC2CMessageData } from "../../Types/MessageDataTypes/SendMessageData/SendC2CMessageDataType";
import { SendMessageData } from "../../Types/MessageDataTypes/SendMessageData/SendMessageDataType";
import { UploadMediaRequest, UploadMediaResponse } from "../../Types/MessageDataTypes/UploadMediaTypes";
import { GetAccessToken, ClearTokenCache } from "../../Utils/AccessToken";
import { MessageCreateEvent } from "./MessageCreateEvent";

/**
 * 处理私信消息事件 (C2C_MESSAGE_CREATE)
 */
export class C2CMessageCreateEvent extends MessageCreateEvent {
    protected async UploadMedia(body: UploadMediaRequest): Promise<UploadMediaResponse> {
        const user_openid: string = (this._data as C2CMessageData).author.id;
        const url = `${this._env.QQBOT_URL}/users/${user_openid}/files`;
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
            const userMsg: C2CMessageData = this._data as C2CMessageData;

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
            const url: string = `${this._env.QQBOT_URL}/users/${openid}/messages`;
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
                console.error(`[SendC2CMessage] 发送失败: ${response.status}`, errorText, reply_msg);

                if (response.status === 401) {
                    console.warn('[SendC2CMessage] Token 已过期，清除缓存');
                    ClearTokenCache();
                }
                return;
            }       
            const result = await response.json();
            console.log(`[SendC2CMessage] 消息发送成功: ${reply_msg.msg_id || 'N/A'}`, result);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async Handle(): Promise<Response> {
        let replyMsg: SendC2CMessageData = (await this.GetSendMessageData()) as SendC2CMessageData;
        replyMsg.msg_id = this._data.id;
        this._ctx.waitUntil(this.PostMessage((this._data as C2CMessageData).author.user_openid,replyMsg));

        return new Response('OK', { status: 200 });
    }
}