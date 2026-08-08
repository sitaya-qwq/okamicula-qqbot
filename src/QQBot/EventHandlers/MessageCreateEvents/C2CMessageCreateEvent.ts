import { qqbotAPIClient } from "../../..";
import { C2CMessageData } from "../../../Types/QQBot/MessageData/ReceiveMessageData/C2CMessageData";
import { SendC2CMessageRequest } from "../../../Types/QQBot/MessageData/SendMessageData/SendC2CMessageRequest";
import { SendMessageRequest } from "../../../Types/QQBot/MessageData/SendMessageData/SendMessageRequest";
import { UploadMediaRequest } from "../../../Types/QQBot/UploadMedia/UploadMediaRequest";
import { UploadMediaResponse } from "../../../Types/QQBot/UploadMedia/UploadMediaResponse";
import { MessageCreateEvent } from "./MessageCreateEvent";

/**
 * 处理私信消息事件 (C2C_MESSAGE_CREATE)
 */
export class C2CMessageCreateEvent extends MessageCreateEvent {
    protected async UploadMedia(file_info: UploadMediaRequest): Promise<UploadMediaResponse> {
        try {
            const recvMsg: C2CMessageData = this.data_ as C2CMessageData;
            return await qqbotAPIClient.UploadC2CMedia(recvMsg.author.id,file_info);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    protected override async GetSendMessageData(): Promise<SendMessageRequest> {
        try {
            const recvMsg: C2CMessageData = this.data_ as C2CMessageData;

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
            await qqbotAPIClient.SendC2CMessage(openid,reply_msg);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    public async Handle(): Promise<Response> {
        let replyMsg: SendC2CMessageRequest = (await this.GetSendMessageData()) as SendC2CMessageRequest;
        replyMsg.msg_id = this.data_.id;
        this.ctx_.waitUntil(this.PostMessage((this.data_ as C2CMessageData).author.user_openid,replyMsg));

        return new Response('OK', { status: 200 });
    }
}