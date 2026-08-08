import { ReceiveMessageData } from "../../../Types/QQBot/MessageData/ReceiveMessageData/ReceiveMessageData";
import { SendMessageRequest } from "../../../Types/QQBot/MessageData/SendMessageData/SendMessageRequest";
import { UploadMediaRequest } from "../../../Types/QQBot/UploadMedia/UploadMediaRequest";
import { UploadMediaResponse } from "../../../Types/QQBot/UploadMedia/UploadMediaResponse";
import { BaseEvent } from "../BaseEvent";

export abstract class MessageCreateEvent extends BaseEvent<ReceiveMessageData> {
    protected abstract PostMessage(openid: string, reply_msg: SendMessageRequest): Promise<void>;
    protected abstract UploadMedia(file_info: UploadMediaRequest): Promise<UploadMediaResponse>;

    protected async GetSendMessageData(replyMsg: SendMessageRequest): Promise<SendMessageRequest> {
        try {
            const recvMsg: ReceiveMessageData = this.data_ as ReceiveMessageData;
            replyMsg.content = recvMsg.content;
            replyMsg.msg_type = 7;
            const fileInfo: UploadMediaRequest = {
                file_type: 1,
                url: "https://i0.hdslb.com/bfs/face/462331b23523d78213b08ea536b76adc81a67616.jpg",
                srv_send_msg: false
            };
            const uploadFileResponse: UploadMediaResponse = await this.UploadMedia(fileInfo);
            replyMsg.media = {file_info: uploadFileResponse.file_info };
            return replyMsg;
        } catch (error) {
            console.error('命令处理错误:', error);
            replyMsg.content = '处理命令时出错，请重试。';
            return replyMsg;
        }
    }


}