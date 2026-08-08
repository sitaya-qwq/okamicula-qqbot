import { qqbotAPIClient } from "../../..";
import { GroupMessageData } from "../../../Types/QQBot/MessageData/ReceiveMessageData/GroupMessageData";
import { SendGroupMessageRequest } from "../../../Types/QQBot/MessageData/SendMessageData/SendGroupMessageRequest";
import { SendMessageRequest } from "../../../Types/QQBot/MessageData/SendMessageData/SendMessageRequest";
import { UploadMediaRequest } from "../../../Types/QQBot/UploadMedia/UploadMediaRequest";
import { UploadMediaResponse } from "../../../Types/QQBot/UploadMedia/UploadMediaResponse";
import { MessageCreateEvent } from "./MessageCreateEvent";

/**
 * 处理私信消息事件 (C2C_MESSAGE_CREATE)
 */
export class GroupAtMessageCreateEvent extends MessageCreateEvent {
    protected async UploadMedia(file_info: UploadMediaRequest): Promise<UploadMediaResponse> {
        try {
            const recvMsg: GroupMessageData = this.data_ as GroupMessageData;
            return await qqbotAPIClient.UploadGroupMedia(recvMsg.group_openid,file_info);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    protected override async GetSendMessageData(): Promise<SendMessageRequest> {
        try {
            const recvMsg: GroupMessageData = this.data_ as GroupMessageData;
    
            let replyMsg: SendMessageRequest = {
                msg_id: recvMsg.id
            }
            return super.GetSendMessageData(replyMsg);
        }catch(error){
            console.error(error);
            throw error;
        } 
    }


    protected async PostMessage(openid: string, reply_msg: SendMessageRequest): Promise<void> {
        try {
            await qqbotAPIClient.SendGroupMessage(openid,reply_msg);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    public async Handle(): Promise<Response> {
        let replyMsg: SendGroupMessageRequest = (await this.GetSendMessageData()) as SendGroupMessageRequest;
        replyMsg.msg_id = this.data_.id;

        this.ctx_.waitUntil(this.PostMessage((this.data_ as GroupMessageData).group_openid,replyMsg));

        return new Response('OK', { status: 200 });
    }
}